import { Function } from "#typespec/emitter/typescript";
import { Interface, ModelProperty, Namespace, Operation } from "@typespec/compiler";
import { code } from "@typespec/compiler/emitter-framework";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import pc from "picocolors";
import stripAnsi from "strip-ansi";
import { useHelpers } from "../helpers.js";
import { CliType } from "#typespec-cli";

function removeHashAndBold(s: string) {
  return pc.bold(s.replace(/^#+ /, ""));
}

marked.use(
  markedTerminal({
    paragraph: (s: string) => {
      return s.replace(/\n/g, " ");
    },
    firstHeading: removeHashAndBold,
    heading: removeHashAndBold,
  }) as any
);
marked.use({
  breaks: false,
});

export interface HelpTextProps {
  command: Operation | Interface | Namespace;
  options: Map<ModelProperty, string>;
  subcommands: Map<string, CliType>;
}

// TODO: Accumulate output in an array, join, and write with process.stdout.write.
// output code should be a clsoe to a single process.stdout.write with a string.
// although the tables will make that impossible to do entirely.

export function HelpText({ command, options, subcommands }: HelpTextProps) {
  const helpers = useHelpers();
  const commandDoc = helpers.getDoc(command);
  const commandDesc = commandDoc
    ? ((marked(commandDoc) as string).trimEnd()+ "\n")
        .replace(/\n/g, "\\n")
        .replace(/"/g, '\\"')
    : "";
  const helpTable = [...options.keys()]
    .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
    .map((o) => pushOptionHelp(o))
    .join("");

  let subcommandHelp = "";
  if (subcommands.size > 0) {
    subcommandHelp += `
    const subcommandTable = new Table({
      chars: noFormatting,
    });
    `
    subcommandHelp += [... subcommands.entries()].map(([name, cli]) => {
      return pushSubcommandHelp(name, cli);
    }).join("");

    subcommandHelp += `
      console.log(\`\\n${pc.bold("Subcommands\n")}\`);
      console.log(subcommandTable.toString());
    `
  }
  return (
    <Function name={`${command.name}Help`} parameters={{ "noColor?": "boolean" }}>
      {code`
        if (noColor || process.env["NO_COLOR"]) {
          console.log("${command.name} " + handler.version + "\\n");
          console.log("${stripAnsi(commandDesc)}");
        } else {
          console.log("${command.name} ${pc.dim("\" + handler.version + \"")}\\n");
          console.log("${commandDesc}");
        }

        const noFormatting = {
          top: "",
          "top-mid": "",
          "top-left": "",
          "top-right": "",
          "mid-mid": "",
          mid: "",
          middle: "",
          bottom: "",
          "bottom-mid": "",
          "bottom-left": "",
          "bottom-right": "",
          left: "",
          "left-mid": "",
          right: "",
          "right-mid": "",
        };

        const table = new Table({
          chars: noFormatting,
        });
        table.push(["--help, -h", "${pc.dim("Display this help message.")}"])
        ${helpTable}
        console.log(\`${pc.bold("Options\n")}\`);
        console.log(table.toString());
        ${subcommandHelp}
      `}
    </Function>
  );

  function pushOptionHelp(option: ModelProperty) {
    let options = `--${option.name}`;

    if (helpers.option.isInvertable(option)) {
      options += `, --no-${option.name}`;
    }

    if (helpers.option.hasShortName(option)) {
      options += `, -${helpers.option.getShortName(option)}`;
    }

    return `table.push([\`${options}\`, \`${pc.dim(helpers.getDoc(option))}\`]);`;
  }

  function pushSubcommandHelp(name: string, cli: CliType) {
    return `subcommandTable.push(["${name}", \`${pc.dim(helpers.getDoc(cli))}\`]);`;
  }
}

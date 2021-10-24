import { Command, flags } from '@oclif/command';
import { cwd } from '../utils';
import { downloadGitRepo } from '../utils/down';

export default class TestCLI extends Command {
  static description = '开发命令行工具'

  static examples = [
    `$ gyro-cli create cli-name`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [
    { name: 'appName' }
  ]

  async run() {
    const { args } = this.parse(TestCLI);
    const { appName } = args;
    await downloadGitRepo({
      targetDir: cwd,
      projectInfo: {},
      projectName: appName,
      gitRepo: '',
      gitBranch: '',
      options: {
        appName: appName
      }
    });
  }
}

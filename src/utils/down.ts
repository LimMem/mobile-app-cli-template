import download from 'download-git-repo';
import { spinner } from './spinner';
import handlebars from 'handlebars';
import {
  error,
  success,
  cwd
} from './index'
import { checkProjectExist, tplDir } from './file';

const validationInfo = async ({
  targetDir,
  projectInfo,
  projectName,
  gitRepo,
  gitBranch = 'master'
}: any) => {
  const isExit = await checkProjectExist(targetDir);
  if (isExit) {
    error('文件夹已存在，请切换到其他目录或者手动删除当前目录后再试');
    return false;
  }

  if (!gitRepo) {
    error('仓库地址不能为空, 请设置仓库地址');
    return false;
  }

  if (!projectName) {
    error('项目名称不能为空, 请设置项目名称');
    return false;
  }


  return {
    targetDir,
    projectInfo,
    projectName,
    gitRepo,
    gitBranch
  }
};


export const downloadGitRepo = async ({
  targetDir,
  projectInfo,
  projectName,
  gitRepo,
  gitBranch,
  options
}: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      const validate = await validationInfo({
        targetDir,
        projectInfo,
        projectName,
        gitRepo,
        gitBranch,
      });

      if (validate !== false) {
        download(`${gitRepo}#${gitBranch}`, projectName, { clone: true }, (err: any) => {
          if (err) {
            spinner.fail();
            reject(err);
            return;
          }
          const path = `${cwd}/${projectName}`;
          spinner.succeed()
          tplDir(path, options);
          success('初始化模板成功');
          resolve(`${cwd}/${projectName}`);
        });
      }
    } catch (error) {
      reject(error);
    }

  });
};

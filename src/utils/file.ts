const fs = require("fs");
const path = require("path");
import handlebars from 'handlebars';
import inquirer from 'inquirer';
import {
  warn,
} from './logger'

/**
 * 从文件夹读取所有文件路径
 * @param dir 文件路径
 */
const getFilesPathWithDir = (dirPath: string) => {
  const fsSync = (dPath: string, paths: string[]) => {
    fs.readdir(dPath, (err: any, files: string[]) => {
      if (err) throw err;
      files.forEach((file: string) => {
        //拼接获取绝对路径，fs.stat(绝对路径,回调函数)
        let fPath = path.join(dirPath, file);
        fs.stat(fPath, (error: any, stat: { isFile: () => any; }) => {
          if (!error) {
            if (stat.isFile()) {
              paths.push(fPath);
            } else {
              fsSync(fPath, paths);
            }
          }
        });
      });
    });
  };
  let resultPath: string[] = [];
  fsSync(dirPath, resultPath);
  return resultPath;
}

export const tplFile = (filePath: string, options: any) => {
  const packageContent = fs.readFileSync(filePath, 'utf-8')
  //使用handlebars解析模板引擎
  const packageResult = handlebars.compile(packageContent)(options)
  //将解析后的结果重写到package.json文件中
  fs.writeFileSync(filePath, packageResult)
};

export const tplDir = (dir: string, options: any) => {
  if (!dir) {
    return;
  }
  const paths = getFilesPathWithDir(dir);
  paths.forEach(path => {
    tplFile(path, options);
  });
};

// 检查是否已经存在相同名字工程
export const checkProjectExist = async (targetDir: string) => {
  if (fs.existsSync(targetDir)) {
    const answer: any = await inquirer.prompt({
      type: 'list',
      name: 'checkExist',
      message: `\n仓库路径${targetDir}已存在，请选择`,
      choices: ['覆盖', '取消'],
    })
    if (answer?.checkExist === '覆盖') {
      warn(`删除${targetDir}...`)
      fs.removeSync(targetDir)
    } else {
      return true
    }
  }
  return false
}


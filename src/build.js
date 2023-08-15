const fs = require("fs");
const glob = require("glob");
const path = require("path");
const Terser = require("terser");

const folderPath = "./dist";

const fileNames = glob.sync(`${folderPath}/**/*.js`);

const terserOptions = {
  output: {
    comments: false,
  },
};

async function optimizeFiles() {
  for (const filePath of fileNames) {
    const originalCode = fs.readFileSync(filePath, "utf8");
    try {
      const result = await Terser.minify(originalCode, terserOptions);

      if (result.error) {
        console.error(`${filePath}에서 에러가 발생했습니다.:`, result.error);
      } else {
        fs.writeFileSync(filePath, result.code, "utf8");
        console.log(`${filePath}의 최적화가 되었습니다.`);
      }
    } catch (error) {
      console.error(`${filePath}에서 에러가 발생했습니다.:`, error);
    }
  }

  console.log("빌드 최적화가 완료되었습니다.");
}

optimizeFiles();

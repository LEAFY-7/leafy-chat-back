const path = require("path");
const fs = require("fs");
const Terser = require("terser");

// 읽어올 파일 경로
const inputFilePath = path.join(__dirname, "./server.js"); // 현재 디렉토리의 server.js

// 미니파이케이션 작업
const code = fs.readFileSync(inputFilePath, "utf8");
const result = Terser.minify(code);

// 최적화된 코드를 파일에 쓰기
if (result.error) {
  console.error("Error during minification:", result.error);
} else if (result.code !== undefined) {
  const outputFilePath = path.join(__dirname, "server.min.js");
  const outputDirectory = path.dirname(outputFilePath);
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }
  fs.writeFileSync(outputFilePath, result.code);
  console.log("트리 쉐이킹 완료.");
} else {
  console.error("Minification result does not contain code.");
}
console.log("트리 쉐이킹 완료.");

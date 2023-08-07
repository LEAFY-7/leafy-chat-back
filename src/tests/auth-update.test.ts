import "mocha";
import { expect } from "chai";
const chai = require("chai");
const chaiHttp = require("chai-http");

import server from "../app";
import UserModel from "../models/user/user.model";

const END_POINT = "/api/v1/auth/update-user";
chai.use(chaiHttp);

const userId = 123;
describe("유저 정보 업데이트 API 테스트", () => {
  it("유저 정보 업데이트 성공", async () => {
    const updatedInfo = {
      userId,
      email: "updated@example.com",
      nickName: "UpdatedUser",
      imgUrl: "new-image-url",
    };

    const res = await chai.request(server).put(END_POINT).send(updatedInfo);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("object");
    expect(res.body.email).to.equal(updatedInfo.email);
    expect(res.body.nickName).to.equal(updatedInfo.nickName);
    expect(res.body.imgUrl).to.equal(updatedInfo.imgUrl);
  });

  it("유저 정보 업데이트 실패 (존재하지 않는 사용자)", async () => {
    const updatedInfo = {
      userId,
      email: "updated@example.com",
      nickName: "UpdatedUser",
      imgUrl: "new-image-url",
    };

    const res = await chai.request(server).put(END_POINT).send(updatedInfo);

    expect(res.status).to.equal(404);
    expect(res.body).to.be.an("object");
    expect(res.body.message).to.equal("해당 유저를 찾지 못했습니다.");
  });
});

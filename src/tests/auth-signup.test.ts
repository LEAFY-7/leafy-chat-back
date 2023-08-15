import "mocha";
import { expect } from "chai";
const chai = require("chai");
const chaiHttp = require("chai-http");

import server from "../app";
import userModel from "../models/user/user.model";

const END_POINT = "/api/v1/auth/signup";
chai.use(chaiHttp);
const userId = 123;

describe("회원가입 API 테스트", () => {
  before(async () => {
    await userModel.deleteMany({});
  });

  it("회원가입 성공", async () => {
    // Given
    const newUser = {
      userId,
      email: "test@example.com",
      nickName: "TestUser",
    };

    // When
    const res = await chai.request(server).post(END_POINT).send(newUser);

    // Then
    expect(res.status).to.equal(201);
    expect(res.body).to.be.an("object");
    expect(res.body.userId).to.equal(newUser.userId);
    expect(res.body.email).to.equal(newUser.email);
    expect(res.body.nickName).to.equal(newUser.nickName);
  });

  it("중복된 사용자로 회원가입 실패", async () => {
    const duplicateUser = {
      userId,
      email: "test2@example.com",
      nickName: "TestUser2",
    };

    const res = await chai.request(server).post(END_POINT).send(duplicateUser);

    expect(res.status).to.equal(400);
    expect(res.body).to.be.an("object");
    expect(res.body.message).to.equal("이미 채팅 아이디가 있습니다.");
  });
});

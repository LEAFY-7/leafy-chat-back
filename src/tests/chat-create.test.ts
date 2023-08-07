import "mocha";
import { expect } from "chai";
const chai = require("chai");
const chaiHttp = require("chai-http");

import server from "../app";
import ChatRoomModel from "../models/chat/chat-room.model";

const END_POINT = "/api/v1/chat";
chai.use(chaiHttp);

describe("채팅방 등록 테스트 성공", () => {
  it("채팅방 개설 성공", async () => {
    const roomId = "123_456";

    const res = await chai.request(server).put(END_POINT).send(roomId);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("object");
    expect(res.body.roomId).to.equal(roomId);
  });

  it("채팅방 등록 테스트 실패 ", async () => {
    const roomId = "123_456";

    const res = await chai.request(server).put(END_POINT).send(roomId);

    expect(res.status).to.equal(401);
    expect(res.body).to.be.an("object");
  });
});

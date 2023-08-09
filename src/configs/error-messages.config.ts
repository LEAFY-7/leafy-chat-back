const http = {
  duplicateUserId: "이미 채팅 아이디가 있습니다.",
  notFoundUser: "사용자를 찾을 수 없습니다.",
  notFoundRoom: "방을 찾을 수 없습니다.",
  unauthorizeRoom: "삭제 권한이 없습니다.",
} as const;

const socket = {
  notFoundRoom: "채팅방을 찾을 수 없습니다. ",
  unauthorizedRoom: "권한이 없습니다.",
};
export default { http, socket };

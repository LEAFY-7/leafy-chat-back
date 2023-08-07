const responseMessages = {
  dbError: {
    status: 500,
    message: "DB에 응답을 요청하는 중 에러가 발생했습니다.",
  },
  unauthorized: {
    status: 401,
    message: "인증이 되지 않았습니다.",
  },
  notFound: {
    status: 404,
    message: "해당 리소스를 찾지 못했습니다.",
  },
} as const;

export default { responseMessages };

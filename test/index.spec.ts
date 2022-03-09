import doDistinguish from "../dist/index";

test("测试转文字", async function () {
  const result = await doDistinguish(
    "https://cdn.blog.athesoft.com//halo/test_1646837664333.mp4"
  );

  expect(result).toEqual({
    datalist: [
      {
        content:
          "现在有钱人都用小小挂钩，墙上挂用处真是无限大，你想挂啥就挂啥。",
        endTime: 7.74,
        index: 0,
        sc: "0.92",
        si: "0",
        speaker: "段落-0",
        startTime: 0,
      },
    ],
  });
});

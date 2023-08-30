test('Env subdomain and key variables are set', () => {
  expect(process.env.SUB_DOMAIN).toEqual(expect.any(String));
  expect(process.env.API_KEY).toEqual(expect.any(String));
  expect(true).toBe(true);
});

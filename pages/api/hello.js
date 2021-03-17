// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  console.log(req.user);
  res.statusCode = 200
  res.json({ name: req.user._json.name })
}

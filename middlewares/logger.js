export default function logger() {
  return (req, res, next) => {
    const time = new Date().toISOString();
    const method = req.method;
    const url = req.url;

    console.log(`[${time}] ${method} ${url}`);

    next();
  };
}

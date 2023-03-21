// export default (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };

export default (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

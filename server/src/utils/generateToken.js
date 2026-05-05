// import jwt from "jsonwebtoken";

// export const generateToken = (id) => {
//   return jwt.sign(
//     { _id: id }, // ✅ Make sure the key is "_id"
//     process.env.JWT_SECRET,
//     { expiresIn: "30d" } // 30 days validity
//   );
// };



import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
};

import { v4 as uuidv4 } from "uuid";
import { Session } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import {
  addressCheckMiddleware,
  pinataApiKye,
  pinataApiSecretKye,
  withSession,
} from "./utils";
import { FileReq } from "@_types/nft";
import axios from "axios";
import FormData from "form-data";

export default withSession(
  async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    if (req.method === "POST") {
      try {
        const { bytes, fileName, contentType } = req.body as FileReq;

        if (!bytes || !fileName || !contentType) {
          return res.status(422).send({ message: "Image file is invalid." });
        }

        await addressCheckMiddleware(req, res);

        const buffer = Buffer.from(Object.values(bytes));
        const formData = new FormData();
        formData.append("file", buffer, {
          contentType,
          filename: fileName + "-" + uuidv4(),
        });

        const fileRes = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            maxBodyLength: Infinity,
            headers: {
              "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
              pinata_api_key: pinataApiKye,
              pinata_secret_api_key: pinataApiSecretKye,
            },
          }
        );
        return res.status(200).send(fileRes.data);
      } catch {
        return res.status(422).send({ message: "Cannot create JSON" });
      }
    } else {
      return res.status(200).send({ message: "Invalid api route" });
    }
  }
);

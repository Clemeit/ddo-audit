import path from "path";
import express from "express";

interface Props {
  api: express.Express;
}

const demographicsApi = ({ api }: Props) => {
  const demographicsMap = [
    ["leveldistribution", "leveldistributionquarter"],
    ["classdistribution", "classdistributionquarter"],
    ["racedistribution", "racedistributionquarter"],
    ["leveldistribution_banks", "leveldistributionquarter_banks"],
    ["classdistribution_banks", "classdistributionquarter_banks"],
    ["racedistribution_banks", "racedistributionquarter_banks"],
  ];

  demographicsMap.forEach((entry: string[]) => {
    api.get(`/demographics/${entry[0]}`, (_, res) => {
      res.setHeader("Content-Type", "application/json");
      res.sendFile(path.resolve(`./api_v1/demographics/${entry[1]}.json`));
    });
  });
};

export default demographicsApi;

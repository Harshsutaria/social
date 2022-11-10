const hostIp = process.env.hostIp || "3.7.44.41";

const Properties = {
  rdbms: {
    port: 5432,
    host: hostIp,
    user: "openerp",
    password: "openerp",
  },
};

module.exports = Properties;

const ACCEPTED_COMMANDS_OBJECT = [
  { command: "/desc", column: "description" },
  { command: "/price", column: "price" },
  { command: "/shipping", column: "shipping" },
  { command: "/buy", column: null },
];

module.exports = {
  acceptedCommandsObject: ACCEPTED_COMMANDS_OBJECT,
};

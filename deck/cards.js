const targossas = ["Ksha", "Halos", "Watcher"];
const mhaldor = ["Anton"];
const cyrene = ["Claes"];
const eleusis = ["Tesha"];
const hashan = ["Minkai"];
const ashtan = ["Imyrr"];

//tesha card does slowmode on a channel
//Ksha  card auto replys from a list of replies
//Anton card to delete lines with delay
//Halos card to pin messages
//Claes card to make a thread
//Imyrr card to reply to a message with a random gif
//Minkai card to have the bot whisper a secret to a person

const cardDescriptions = [
  { name: "Ksha", desc: "will auto reply to the targets next X messages from a list of responses. !ldeck draw ksha @<who>" },
  { name: "Halos", desc: "will pin a message if drawn in a reply !ldeck draw halos in a reply" },
  { name: "Watcher", desc: "will change the targets nickname (Admin cannot be targeted) !ldeck draw watcher @<who> <nickname>" },
  { name: "Anton", desc: "will delete a message you reply to !ldeck draw anton in a reply" },
  { name: "Claes", desc: "will start a thread !ldeck draw claes <threadTitle>" },
  { name: "Tesha", desc: "will enable slowmode for 1 minute in the channel you draw it in. !ldeck draw tesha" },
  { name: "Minkai", desc: "will send a whisper from the bot anonomously to whoever you draw it for !ldeck draw minkia @<who>" },
  { name: "Imyrr", desc: "will reply to a message with a random gif, how chaotic." },
];

const cards = [
  ...targossas,
  ...mhaldor,
  ...cyrene,
  ...eleusis,
  ...hashan,
  ...ashtan,
];

export { cards, cardDescriptions };

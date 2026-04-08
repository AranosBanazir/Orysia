 function cap(str) {
  if (!str) return str; // handles empty/null
  return str.charAt(0).toUpperCase() + str.slice(1);
}



function getCommands(){
    let display = ``
  const commands = [
    {
      desc: 'Get the current KDR of a player, as well as tracked kills by class.',
      syntax: '!kdr <player>',
      name: 'KDR'
    },
    {
      desc: 'Get a sorted by city list of every player currently in the realms.',
      syntax: '!qwc',
      name: 'QWC'
    },
    {
      desc: 'Give me pets.',
      syntax: '!pet',
      name: 'PET'
    },
    {
      desc: 'Get current player information for a specified player',
      syntax: '!whois <player>',
      name: 'WHOIS'
    },
    {
      desc: 'Get a specific newspost from any of the publicly available boards: Public, Announce, Events, Changes, Classleads, and Poetry.',
      syntax: '!news <section> <postID>',
      name: 'NEWS'
    },
    {
      desc: 'Get a snapshot of each class and how many total recorded kills they have.',
      syntax: '!classleaderboard',
      name: 'LEADERBOARD'
    }
  ]

  for (const command of commands){
    display = display + `${command.name}\n  ${command.syntax}: ${command.desc}\n`
  }
  return display
}



function buffer(word, spaces){
    let i = 0
    let diff = spaces - word.length
    let ret = ''
    while (i < diff){
        ret = ret + ' '
        i++
    }   
    return ret
}

export {cap, getCommands, buffer}
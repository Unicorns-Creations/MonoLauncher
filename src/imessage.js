async function getAvatar(id) {
  return new Promise((resolve, reject) => {
    ipcRenderer.invoke('steam-avatar', id).then(function (result) {
      resolve(result)
    })
  })
}
async function getMessages(id) {
  ipcRenderer.invoke('request-imsgs').then(async (result) => {
    if (result == "404") {
      createMsg("Couldn't find Gmod", true)
      return
    }
    var mParent = document.getElementById("messageContainer");
    var authorElement = document.getElementById("AuthorName");
    mParent.innerHTML = ""
    result.forEach(rs => {
      if (rs.id != id) return
      authorElement.innerText = rs.name
      rs.chats.forEach(chat => {
        createMsg(chat.msg, chat.isLocal)
      })
    })
  });
}
async function createNew(name, id) {
  var pParent = document.getElementById("participants");
  var pNew = document.createElement("li");
  var pAvatar = document.createElement("img");
  var pName = document.createElement("span")
  if (!id) {
    pAvatar.src = "https://pbs.twimg.com/profile_images/891726146252832768/iH9vBiwD.jpg";
  } else {
    pAvatar.src = await getAvatar(id)
  }

  pAvatar.id = "participantAvatar";
  pName.className = "participantName";
  pName.innerHTML = ` ${name}`;
  pName.id = id

  pNew.onclick = function () {
    getMessages(id)
  }
  pNew.appendChild(pAvatar);
  pNew.appendChild(pName);
  pParent.appendChild(pNew);
}

function addUsers(search) {
  if (!search) search = ""
  document.querySelectorAll("#participants > li").forEach(f => f.remove())
  ipcRenderer.invoke('request-imsgs').then(function (result) {
    if (result == "404") {
      createNew("Couldn't find Gmod")
    }
    result.forEach(rs => {
      if (String(rs.name).toLowerCase().includes(String(search).toLowerCase())) {
        createNew(rs.name, rs.id)
      }
    })
  });
}

function createMsg(message, self) {
  var mParent = document.getElementById("messageContainer");
  var mNew = document.createElement("li");

  mNew.innerHTML = message
  if (self) {
    mNew.className = "self"
  } else {
    mNew.className = "opp"
  }
  mParent.appendChild(mNew);
}

addUsers()
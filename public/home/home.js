const creteGroupButton = document.getElementById("create-group-button");
const input = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const logoutButton = document.getElementById("logout-button");
const generateButton = document.getElementById("generate-link");
const groupNameTag = document.getElementById("group-name");
const groupList = document.getElementById("group-list");
const groupInput = document.getElementById("group-search");
const inviteInput = document.getElementById("inviteLink");
const inviteButton = document.getElementById("invite-button");
const menuButton = document.getElementById("menu-button");
const dropdownMenu = document.getElementById("dropdown-menu");
const userName = document.getElementById("user-name");
const leaveGroupButton = document.getElementById("leave-group");
const onlineClientList = document.getElementById("online-list");

// important variables
let currentGroupId = null;
const token = localStorage.getItem("token");
const socket = io("http://localhost:3000", {
  extraHeaders: {
    Authorization: `${token}`,
  },
});

// Initialize the chat app
window.addEventListener("DOMContentLoaded", async () => {
  sendButton.addEventListener("click", sendMessage);
  logoutButton.addEventListener("click", logout);
  leaveGroupButton.addEventListener("click", leaveGroup);
  await fetchGroups();
});

socket.on("messageReceived", (data) => {
  if (data.groupId === currentGroupId) {
    displayLiveMessages(data);
  }
});

function displayLiveMessages(message) {
  const chatArea = document.getElementById("chat-area");
  const messageElement = document.createElement("li");
  messageElement.classList.add("message");
  messageElement.textContent = `${message.user}: ${message.message}`;
  chatArea.appendChild(messageElement);
}

function displayMessages(messages) {
  const chatArea = document.getElementById("chat-area");
  chatArea.innerHTML = "";
  messages.forEach(displayMessage);
}

// Display a single message in the chat area
function displayMessage(message) {
  const chatArea = document.getElementById("chat-area");
  const messageElement = document.createElement("li");
  messageElement.classList.add("message");
  messageElement.textContent = `${message.User.name}: ${message.message}`;
  chatArea.appendChild(messageElement);
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

async function fetchGroups() {
  try {
    const response = await axios.get("http://localhost:3000/api/groups", {
      headers: { Authorization: `${token}` },
    });
    userName.innerText = response.data.userName;
    displayGroups(response.data.groups);
  } catch (error) {
    console.error(error);
  }
}

function displayGroups(groups) {
  groupList.innerHTML = "";
  groups.forEach((group) => {
    const li = document.createElement("li");
    li.textContent = group.chatGroup.name;
    li.addEventListener("click", () =>
      loadGroupChat(group.groupId, group.chatGroup.name)
    );
    groupList.appendChild(li);
  });
}

creteGroupButton.addEventListener("click", async () => {
  const { value: groupName } = await Swal.fire({
    title: "Create Group",
    input: "text",
    inputPlaceholder: "Enter group name",
    showCancelButton: true,
  });
  if (groupName) {
    try {
      await axios.post(
        "http://localhost:3000/api/groups",
        { name: groupName },
        { headers: { Authorization: `${token}` } }
      );
      fetchGroups();
    } catch (error) {
      console.error(error);
    }
  }
});

async function loadGroupChat(groupId, groupName) {
  currentGroupId = groupId;
  // Join the current group
  socket.emit("joinGroup", currentGroupId);
  groupNameTag.textContent = groupName;
  await fetchGroupMessages(groupId);
}

async function fetchGroupMessages(groupId) {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/group/messages/${groupId}`,
      { headers: { Authorization: `${token}` } }
    );
    displayMessages(response.data.messages);
  } catch (error) {
    console.error(error);
  }
}

async function sendMessage() {
  const message = input.value.trim();

  if (message && currentGroupId) {
    try {
      socket.emit("messageSent", { groupId: currentGroupId, message });
      input.value = "";
    } catch (error) {
      console.error(error);
    }
  }
}

// Dropdown menu functionality
menuButton.addEventListener("click", () => {
  dropdownMenu.classList.toggle("hidden");
});

// Generate Invite Link
generateButton.addEventListener("click", async () => {
  try {
    const groupId = currentGroupId;
    const response = await axios.post(
      "http://localhost:3000/api/group/invite",
      { groupId },
      { headers: { Authorization: `${token}` } }
    );
    //close the dropdown menu
    dropdownMenu.classList.add("hidden");
    Swal.fire({
      toast: true,
      icon: "success",
      text: response.data.inviteLink,
      showConfirmButton: true,
    });
  } catch (error) {
    if (error.response.status === 404) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        text: "select the group first",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
    if (error.response.status === 403) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        text: "Admin can only generate invite link",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  }
});

// join group
inviteButton.addEventListener("click", async () => {
  try {
    const inviteLink = inviteInput.value.trim();
    if (inviteLink) {
      const groupId = inviteLink.split("/")[1];
      await axios.post(
        `http://localhost:3000/api/group/join/${groupId}`,
        { groupId },
        { headers: { Authorization: `${token}` } }
      );
      currentGroupId = groupId;
      fetchGroups();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        text: "You have joined the group",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    console.error(error);
  }
});

// View Members
document.getElementById("view-members").addEventListener("click", async () => {
  // close the dropdown menu
  dropdownMenu.classList.add("hidden");
  try {
    const groupId = currentGroupId;
    const response = await axios.get(
      `http://localhost:3000/api/group/members/${groupId}`,
      { headers: { Authorization: ` ${token}` } }
    );

    const members = response.data.members
      .map((m) => `<li style="list-style-type: none">${m.User.name}</li>`)
      .join("");
    Swal.fire({
      html: `<ul>${members}</ul>`,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Could not fetch group members", "error");
  }
});

// Delete Group
document.getElementById("delete-group").addEventListener("click", async () => {
  // close the dropdown menu
  dropdownMenu.classList.add("hidden");
  try {
    const groupId = currentGroupId;

    const response = await axios.delete(
      `http://localhost:3000/api/group/${groupId}`,
      {
        headers: { Authorization: `${token}` },
      }
    );
    console.log(response);
    if (response.status === 200) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        text: "Group deleted successfully",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
    await fetchGroups();
  } catch (error) {
    console.error(error);
    if (error.response.status === 403) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        text: "Admin can only delete the group",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
    if (error.response.status === 500) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        text: "Something went wrong",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  }
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

// search function for groups
groupInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    for (let i = 0; i < groupList.children.length; i++) {
      if (
        groupList.children[i].textContent
          .toLowerCase()
          .includes(groupInput.value.toLowerCase())
      ) {
        groupList.children[i].style.display = "block";
      } else {
        groupList.children[i].style.display = "none";
      }
    }
  }
});

// leave group
async function leaveGroup() {
  try {
    const groupId = currentGroupId;
    console.log("groupId", groupId);
    await axios.delete(`http://localhost:3000/api/group/leave/${groupId}`, {
      headers: { Authorization: `${token}` },
    });
    currentGroupId = null;
    await fetchGroups();
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      text: "You have left the group",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.log(error);
    if (error.response.status === 403) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        text: "admin cannot leave the group",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  }
}

socket.on("onlineClients", (clients) => {
  const onlineList = document.getElementById("online-list");
  onlineList.innerHTML = "";
  clients.forEach((client) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${client.name}`;
    onlineList.appendChild(listItem);
  });
});
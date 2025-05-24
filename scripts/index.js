"use strict";
const cardDataMap = {};
const allTab = document.getElementById("all");
const activeTab = document.getElementById("active");
const inactiveTab = document.getElementById("inactive");
const tabs = [allTab, activeTab, inactiveTab];
const activeClass = "tab-active";
const inactiveClass = "tab-inactive";
const hideCardClass = "hide-card";
const fadeOutClass = "fade-out";
const moonIcon = document.querySelector(".moon-icon");
if (moonIcon) {
    moonIcon.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        const moonImg = moonIcon.querySelector("img");
        if (moonImg) {
            moonImg.src = isDarkMode ? "./assets/images/icon-sun.svg" : "./assets/images/icon-moon.svg";
            moonImg.alt = isDarkMode ? 'sun icon' : 'moon icon';
        }
    });
}
const createCard = (data, buttonid) => {
    try {
        const cardContainer = document.getElementById('card-container');
        const cardTemplate = document.getElementById('card-template');
        const card = cardTemplate.content.cloneNode(true);
        const cardContainerDiv = card.querySelector(".card");
        cardContainerDiv.id = buttonid;
        const logoImg = card.querySelector("img");
        const heading = card.querySelector("h3");
        const description = card.querySelector("p");
        const removeButton = card.querySelector('.card-remove-btn');
        const toggleInput = card.querySelector('.toggle-input');
        logoImg.src = data.logo;
        logoImg.alt = `${data.name} icon`;
        heading.textContent = data.name;
        description.textContent = data.description;
        removeButton.setAttribute('data-card-id', buttonid);
        toggleInput.checked = data.isActive;
        cardContainer.appendChild(card);
        cardDataMap[cardContainerDiv.id] = data;
    }
    catch (error) {
        console.log("error cloning template: ", error);
    }
};
fetch("data.json")
    .then(response => response.json())
    .then((data) => {
    data.forEach((element, index) => {
        createCard(element, `card-${index}`);
    });
})
    .catch((e) => {
    console.log("could not fetch file with error: ", e);
});
const filterCards = (cardContainer, isActive) => {
    const cardsArray = Array.from(cardContainer.children);
    cardsArray.forEach(card => {
        const id = card.id;
        if (isActive !== undefined) {
            if (cardDataMap[id].isActive === !isActive) {
                card.classList.add(hideCardClass);
            }
            else {
                card.classList.remove(hideCardClass);
            }
        }
        else {
            card.classList.remove(hideCardClass);
        }
    });
};
function selectTab() {
    try {
        const cardContainer = document.getElementById("card-container");
        function setActiveTab(clickedTab) {
            tabs.forEach(tab => {
                if (tab === clickedTab) {
                    if (tab.classList.contains(inactiveClass)) {
                        tab.classList.replace(inactiveClass, activeClass);
                    }
                }
                else {
                    if (tab.classList.contains(activeClass)) {
                        tab.classList.replace(activeClass, inactiveClass);
                    }
                }
            });
        }
        allTab.addEventListener("click", () => {
            setActiveTab(allTab);
            filterCards(cardContainer);
        });
        activeTab.addEventListener("click", () => {
            setActiveTab(activeTab);
            filterCards(cardContainer, true);
        });
        inactiveTab.addEventListener("click", () => {
            setActiveTab(inactiveTab);
            //only inactive cards
            filterCards(cardContainer, false);
        });
    }
    catch (error) {
        console.log("something went wrong in selectTab: ", error);
    }
}
selectTab();
function removeCard() {
    try {
        const container = document.getElementById("card-container");
        container.addEventListener("click", (event) => {
            const targetElement = event.target;
            if (targetElement.classList.contains('card-remove-btn')) {
                const cardToRemoveId = targetElement.dataset.cardId;
                const cardToRemove = document.getElementById(cardToRemoveId);
                cardToRemove.remove();
            }
        });
    }
    catch (error) {
        console.log("remove card failed with error: ", error);
    }
}
removeCard();
function toggleActivity() {
    try {
        const container = document.getElementById("card-container");
        container.addEventListener("change", (event) => {
            const targetElement = event.target;
            if (targetElement.classList.contains("toggle-input")) {
                const cardToggled = targetElement.closest(".card");
                const id = cardToggled.id;
                if (cardDataMap[id]) {
                    cardDataMap[id].isActive = targetElement.checked;
                    const tab = document.querySelector(".activity-tabs .tab-active");
                    if (tab === allTab) {
                        cardToggled.classList.remove(hideCardClass);
                    }
                    else if (tab === activeTab) {
                        if (cardDataMap[id].isActive) {
                            cardToggled.classList.add(fadeOutClass);
                            setTimeout(() => cardToggled.classList.remove(hideCardClass), 300);
                        }
                        else {
                            cardToggled.classList.add(fadeOutClass);
                            setTimeout(() => cardToggled.classList.add(hideCardClass), 300);
                        }
                    }
                    else if (tab === inactiveTab) {
                        if (cardDataMap[id].isActive) {
                            cardToggled.classList.add(fadeOutClass);
                            setTimeout(() => cardToggled.classList.add(hideCardClass), 300);
                        }
                        else {
                            cardToggled.classList.add(fadeOutClass);
                            setTimeout(() => cardToggled.classList.remove(hideCardClass), 300);
                        }
                    }
                    else if (tab === inactiveTab) {
                    }
                    else {
                        console.log("should not get here");
                    }
                }
            }
        });
    }
    catch (error) {
        console.log("error setting up toggle: ", error);
    }
}
toggleActivity();

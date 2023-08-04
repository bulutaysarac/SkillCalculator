class SkillRequirement {
    constructor(skillId, minPoints) {
        this.skillId = skillId;
        this.minPoints = minPoints;
    }
}

class Skill {
    constructor(id, name, feature, featureUnit, featureValues, skillRequirements, skillGroup) {
        this.id = id;
        this.name = name;
        this.feature = feature;
        this.featureUnit = featureUnit;
        this.points = 0;
        this.featureValues = featureValues;
        this.skillRequirements = skillRequirements;
        this.skillGroup = skillGroup;
    }

    increasePoint() {
        if (this.skillRequirements) {
            for (let i = 0; i < this.skillRequirements.length; i++) {
                const reqSkill = skills.find(skill => skill.id === this.skillRequirements[i].skillId);
                if (reqSkill.points < this.skillRequirements[i].minPoints) {
                    playSound("sounds/error.mp3");
                    return;
                }
            }
        }

        if (this.points < this.featureValues.length) {
            this.points++;
            playSound("sounds/positive.mp3");
        } else {
            playSound("sounds/error.mp3");
        }
    }

    decreasePoint() {
        if (this.points > 0) {
            this.points--;
            playSound("sounds/negative.mp3");
            return;
        }
        playSound("sounds/error.mp3");
    }
}

let skills = [
    new Skill(1, "Harpoon Rush", "Harpoon Reload", "ms", [-200, -400, -600, -800, -1000], null, 0),
    new Skill(2, "Swordfish", "Harpoon Damage", "%", [2, 4, 6, 8, 10], [new SkillRequirement(1, 3)], 0),
    new Skill(3, "Fury of Thunder", "Rocket Damage", "%", [8, 16, 24, 32, 40], [new SkillRequirement(2, 3)], 0),
    new Skill(4, "Hidden Arsenal", "Cannon Damage", "%", [3, 5, 7, 9, 11], [new SkillRequirement(3, 3)], 0),
    new Skill(5, "Swift Salvos", "Cannon Reload", "ms", [-150, -300, -450, -600, -750], [new SkillRequirement(4, 3)], 0),
    new Skill(6, "Gunpowder Blitz", "Powder Damage", "%", [4, 6, 8, 10, 12], [new SkillRequirement(5, 3)], 0),
    new Skill(7, "Connonade Mastery", "Cannon Range", "unit", [25, 25, 25, 25, 25], [new SkillRequirement(6, 4)], 0),

    new Skill(8, "Health Fountain", "Hit Points", "unit", [2000, 2500, 2000, 2000, 1500], null, 1),
    new Skill(9, "Anti Rocket", "Less Rocket Damage", "%", [5, 15, 20, 25, 30], [new SkillRequirement(8, 3)], 1),
    new Skill(10, "Captain's Determination", "Less Critical Damage", "%", [5, 10, 20, 30, 35], [new SkillRequirement(9, 3)], 1),
    new Skill(11, "Healing Boost", "Healing Value", "%", [4, 8, 12, 16, 20], [new SkillRequirement(10, 3)], 1),
    new Skill(12, "Masterful Mend", "Repair Value", "%", [4, 8, 12, 16, 20], [new SkillRequirement(11, 3)], 1),
    new Skill(13, "Ironclad Armor", "Less Damage With Plates", "%", [2, 4, 6, 8, 10], [new SkillRequirement(12, 3)], 1),
    new Skill(14, "Revenge", "Reflective Damage", "%", [2, 4, 6, 8, 10], [new SkillRequirement(13, 3), new SkillRequirement(7, 3)], 1),

    new Skill(15, "Golden Plunder", "Gold Loot", "%", [2, 4, 6, 8, 10], null, 2),
    new Skill(16, "Bounty", "Exp Loot", "%", [1, 2, 3, 4, 5], [new SkillRequirement(15, 3)], 2),
    new Skill(17, "Fortune", "Crystal Loot", "%", [1, 2, 3, 4, 5], [new SkillRequirement(16, 3)], 2),
    new Skill(18, "Privateer's Prize", "Elp Loot", "%", [3, 6, 9, 12, 15], [new SkillRequirement(17, 3)], 2),
    new Skill(19, "Mystic Vision", "Vision Range", "unit", [100, 200, 300, 400, 500], [new SkillRequirement(18, 3)], 2),
    new Skill(20, "Swift Sails", "Speed", "unit", [10, 20, 35], [new SkillRequirement(19, 3)], 2),
];

const skillBoxClicked = (e) => {
    const skillBox = e.target.closest(".skill-box");
    const toolTipElement = skillBox.querySelector(".tooltip");
    let skill = skills.find(skill => skill.id === skillBox.skillId);

    if (e.button === 2) {
        toolTipElement.classList.toggle("hidden");
        toolTipElement.classList.toggle("visible");
    }
};

const drawSkillBoxes = () => {
    for (let i = 0; i < skills.length; i++) {
        const skillsContainer = document.getElementsByClassName("skill-group")[skills[i].skillGroup];
        const skillBox = document.createElement("div");
        skillBox.skillId = skills[i].id;
        skillBox.classList.add("skill-box");
        skillBox.addEventListener("click", skillBoxClicked);
        skillBox.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            skillBoxClicked(e);
        });

        const toolTipElement = document.createElement("div");
        toolTipElement.classList.add("tooltip");
        toolTipElement.classList.add("hidden");

        for (let j = 0; j < skills[i].featureValues.length; j++) {
            toolTipElement.innerHTML += `<span class="feature">${skills[i].featureValues[j] + skills[i].featureUnit}</span>`;
            if(j === skills[i].featureValues.length - 1) {
                toolTipElement.innerHTML += `<span class="feature">${skills[i].feature}</span>`;
            }
        }

        const skillNameElement = document.createElement("div");
        skillNameElement.innerText = skills[i].name;
        skillNameElement.classList.add("skill-name");

        const skillBoxMiddleContainer = document.createElement("div");
        skillBoxMiddleContainer.classList.add("skill-box-middle");

        const skillPointElement = document.createElement("div");
        skillPointElement.innerText = skills[i].points;
        skillPointElement.classList.add("skill-point");

        const skillSeperatorElement = document.createElement("div");
        skillSeperatorElement.innerText = "/";
        skillSeperatorElement.classList.add("skill-point-seperator");

        const skillMaxPointElement = document.createElement("div");
        skillMaxPointElement.innerText = skills[i].featureValues.length;
        skillMaxPointElement.classList.add("skill-point-max");

        const skillBoxBottomContainer = document.createElement("div");
        skillBoxBottomContainer.classList.add("skill-box-bottom");

        const btnIncrease = document.createElement("button");
        btnIncrease.classList.add("btn-increase");
        btnIncrease.addEventListener("click", btnIncreaseClicked);
        btnIncrease.innerText = "+";

        const btnDecrease = document.createElement("button");
        btnDecrease.classList.add("btn-decrease");
        btnDecrease.addEventListener("click", btnDecreaseClicked);
        btnDecrease.innerText = "-";

        skillBoxMiddleContainer.append(skillPointElement);
        skillBoxMiddleContainer.append(skillSeperatorElement);
        skillBoxMiddleContainer.append(skillMaxPointElement);

        skillBoxBottomContainer.append(btnIncrease);
        skillBoxBottomContainer.append(btnDecrease);

        skillBox.append(toolTipElement);
        skillBox.append(skillNameElement);
        skillBox.append(skillBoxMiddleContainer);
        skillBox.append(skillBoxBottomContainer);

        skillsContainer.append(skillBox);
    }
}

const updateSkillPoints = (e, action) => {
    const skillBox = e.target.closest(".skill-box");
    const pointsElement = skillBox.querySelector(".skill-point");
    const skillId = skillBox.skillId;
    let skill = skills.find(skill => skill.id === skillId);

    if (action === "increase") {
        skill.increasePoint();
    } else if (action === "decrease") {
        skill.decreasePoint();
    }

    pointsElement.textContent = skill.points;
    calculatePearlCost();
};

const btnIncreaseClicked = (e) => {
    updateSkillPoints(e, "increase");
}

const btnDecreaseClicked = (e) => {
    updateSkillPoints(e, "decrease");
};

const btnResetClicked = (e) => {
    skills.forEach((s) => {
        s.points = 0;
    });

    for (let i = 0; i < 3; i++) {
        const skillsContainer = document.getElementsByClassName("skill-group")[i];
        skillsContainer.innerHTML = "";
    }

    const txtPearlCost = document.getElementById("txtPearlCost");
    txtPearlCost.innerText = "Total Pearl Cost : 0";

    drawSkillBoxes();

    playSound("sounds/reset.mp3");
}

const calculatePearlCost = () => {
    let totalPoints = 0;
    for (let i = 0; i < skills.length; i++) {
        totalPoints += skills[i].points;
    }

    let counter = 0, totalPearlCost = 0;
    for (let i = 0; i < totalPoints; i++) {
        if (i > 0 && i % 5 == 0 && counter < 9) {
            counter++;
        }
        totalPearlCost += counter + 1;
    }

    const txtPearlCost = document.getElementById("txtPearlCost");
    txtPearlCost.innerText = "Total Pearl Cost : " + totalPearlCost;
}

const playSound = (path) => {
    var sound = new Audio(path);
    sound.play();
}

const btnReset = document.getElementById("btnReset");
btnReset.addEventListener("click", btnResetClicked);
drawSkillBoxes();

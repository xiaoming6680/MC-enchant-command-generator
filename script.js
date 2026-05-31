const enchantmentGroups = [
  {
    label: "近战武器",
    options: [
      { id: "sharpness", label: "锋利" },
      { id: "smite", label: "亡灵杀手" },
      { id: "bane_of_arthropods", label: "节肢杀手" },
      { id: "fire_aspect", label: "火焰附加" },
      { id: "knockback", label: "击退" },
      { id: "looting", label: "抢夺" },
      { id: "sweeping_edge", label: "横扫之刃" }
    ]
  },
  {
    label: "工具",
    options: [
      { id: "efficiency", label: "效率" },
      { id: "fortune", label: "时运" },
      { id: "silk_touch", label: "精准采集" }
    ]
  },
  {
    label: "弓",
    options: [
      { id: "power", label: "力量" },
      { id: "punch", label: "冲击" },
      { id: "flame", label: "火矢" },
      { id: "infinity", label: "无限" }
    ]
  },
  {
    label: "弩",
    options: [
      { id: "multishot", label: "多重射击" },
      { id: "piercing", label: "穿透" },
      { id: "quick_charge", label: "快速装填" }
    ]
  },
  {
    label: "三叉戟",
    options: [
      { id: "loyalty", label: "忠诚" },
      { id: "impaling", label: "穿刺" },
      { id: "riptide", label: "激流" },
      { id: "channeling", label: "引雷" }
    ]
  },
  {
    label: "重锤",
    options: [
      { id: "density", label: "密度" },
      { id: "breach", label: "破甲" },
      { id: "wind_burst", label: "风爆" }
    ]
  },
  {
    label: "钓鱼竿",
    options: [
      { id: "luck_of_the_sea", label: "海之眷顾" },
      { id: "lure", label: "饵钓" }
    ]
  },
  {
    label: "通用",
    options: [
      { id: "unbreaking", label: "耐久" },
      { id: "mending", label: "经验修补" },
      { id: "curse_of_vanishing", label: "消失诅咒" }
    ]
  }
];

const defaultState = {
  target: "@a",
  item: "diamond_sword",
  enchantment: "sharpness",
  level: "1"
};

const targetSelect = document.getElementById("targetSelect");
const customTargetInput = document.getElementById("customTargetInput");
const itemSelect = document.getElementById("itemSelect");
const customItemInput = document.getElementById("customItemInput");
const enchantmentList = document.getElementById("enchantmentList");
const addEnchantmentButton = document.getElementById("addEnchantmentButton");
const clearEnchantmentsButton = document.getElementById("clearEnchantmentsButton");
const resetButton = document.getElementById("resetButton");
const commandPreview = document.getElementById("commandPreview");
const errorBox = document.getElementById("errorBox");
const copyButton = document.getElementById("copyButton");
const copyStatus = document.getElementById("copyStatus");
const enchantmentCount = document.getElementById("enchantmentCount");
const targetMeta = document.getElementById("targetMeta");
const itemMeta = document.getElementById("itemMeta");
const enchantMeta = document.getElementById("enchantMeta");

let generatedCommand = "";
let copyStatusTimer = 0;

function buildOptionHtml(selectedValue) {
  return enchantmentGroups
    .map((group) => {
      const options = group.options
        .map((option) => {
          const selected = option.id === selectedValue ? " selected" : "";
          return `<option value="${option.id}" title="${option.id}"${selected}>${option.label}</option>`;
        })
        .join("");

      return `<optgroup label="${group.label}">${options}</optgroup>`;
    })
    .join("");
}

function createEnchantmentRow(enchantment = defaultState.enchantment, level = defaultState.level) {
  const row = document.createElement("div");
  row.className = "enchantment-row";
  row.dataset.enchantRow = "true";

  row.innerHTML = `
    <label class="field">
      <span class="mobile-label">附魔属性</span>
      <select class="enchantment-select">
        ${buildOptionHtml(enchantment)}
      </select>
    </label>

    <label class="field">
      <span class="mobile-label">自定义附魔 ID</span>
      <input class="custom-enchantment-input" type="text" placeholder="留空使用左侧属性">
    </label>

    <label class="field">
      <span class="mobile-label">等级</span>
      <input class="level-input" type="text" inputmode="numeric" min="1" value="${level}" placeholder="1">
    </label>

    <div>
      <span class="mobile-label">操作</span>
      <button class="button danger delete-button" type="button">删除</button>
    </div>
  `;

  row.querySelector(".enchantment-select").addEventListener("change", updateCommand);
  row.querySelector(".custom-enchantment-input").addEventListener("input", updateCommand);
  row.querySelector(".level-input").addEventListener("input", updateCommand);
  row.querySelector(".delete-button").addEventListener("click", () => {
    row.remove();
    updateEmptyMessage();
    updateCommand();
  });

  return row;
}

function addEnchantmentRow(enchantment = defaultState.enchantment, level = defaultState.level) {
  removeEmptyMessage();
  enchantmentList.appendChild(createEnchantmentRow(enchantment, level));
  updateCommand();
}

function removeEmptyMessage() {
  const emptyMessage = enchantmentList.querySelector(".empty-message");
  if (emptyMessage) {
    emptyMessage.remove();
  }
}

function updateEmptyMessage() {
  const rows = getEnchantmentRows();
  const emptyMessage = enchantmentList.querySelector(".empty-message");

  if (rows.length === 0 && !emptyMessage) {
    const message = document.createElement("div");
    message.className = "empty-message";
    message.textContent = "当前没有附魔，生成的指令不会带 enchantments 组件。";
    enchantmentList.appendChild(message);
  }

  if (rows.length > 0 && emptyMessage) {
    emptyMessage.remove();
  }
}

function getEnchantmentRows() {
  return Array.from(enchantmentList.querySelectorAll("[data-enchant-row='true']"));
}

function getTargetValue() {
  const customTarget = customTargetInput.value.trim();
  return customTarget || targetSelect.value;
}

function getItemValue() {
  const customItem = customItemInput.value.trim();
  return customItem || itemSelect.value;
}

function isPositiveInteger(value) {
  return /^[1-9]\d*$/.test(value);
}

function hasNoWhitespace(value) {
  return value.length > 0 && !/\s/.test(value);
}

function setInvalid(control, isInvalid) {
  control.classList.toggle("is-invalid", isInvalid);
  control.setAttribute("aria-invalid", String(isInvalid));
}

function updateSummary() {
  const rowCount = getEnchantmentRows().length;
  const target = getTargetValue();
  const item = getItemValue();
  const enchantText = rowCount > 0 ? `${rowCount} 条` : "无";

  enchantmentCount.textContent = rowCount > 0 ? `${rowCount} 条附魔` : "0 条附魔";
  targetMeta.textContent = target || "未填写";
  itemMeta.textContent = item || "未填写";
  enchantMeta.textContent = enchantText;
}

function readEnchantments(errors) {
  const enchantments = [];

  getEnchantmentRows().forEach((row, index) => {
    const rowNumber = index + 1;
    const selectValue = row.querySelector(".enchantment-select").value;
    const customInput = row.querySelector(".custom-enchantment-input");
    const levelInput = row.querySelector(".level-input");
    const customValue = customInput.value.trim();
    const levelValue = levelInput.value.trim();
    const enchantmentId = customValue || selectValue;
    const customValueValid = customValue.length === 0 || hasNoWhitespace(customValue);
    const levelValid = isPositiveInteger(levelValue);

    setInvalid(customInput, !customValueValid);
    setInvalid(levelInput, !levelValid);
    row.classList.toggle("has-error", !customValueValid || !levelValid);

    if (!customValueValid) {
      errors.push(`第 ${rowNumber} 条附魔 ID 不能为空，且不能包含空格。`);
    }

    if (!levelValid) {
      errors.push(`第 ${rowNumber} 条附魔等级必须是大于或等于 1 的正整数。`);
    }

    if (customValueValid && levelValid) {
      enchantments.push(`${enchantmentId}:${levelValue}`);
    }
  });

  return enchantments;
}

function buildCommand() {
  const errors = [];
  const target = getTargetValue();
  const item = getItemValue();
  const customTarget = customTargetInput.value.trim();
  const customItem = customItemInput.value.trim();
  const targetValid = hasNoWhitespace(target);
  const itemValid = hasNoWhitespace(item);

  setInvalid(customTargetInput, customTarget.length > 0 && !hasNoWhitespace(customTarget));
  setInvalid(customItemInput, customItem.length > 0 && !hasNoWhitespace(customItem));

  if (!targetValid) {
    errors.push("目标玩家不能为空，且不能包含空格。");
  }

  if (!itemValid) {
    errors.push("物品 ID 不能为空，且不能包含空格。");
  }

  const enchantments = readEnchantments(errors);

  if (errors.length > 0) {
    return {
      command: "",
      errors
    };
  }

  const enchantmentPart = enchantments.length > 0
    ? `[enchantments={${enchantments.join(",")}}]`
    : "";

  return {
    command: `/give ${target} ${item}${enchantmentPart}`,
    errors: []
  };
}

function updateCommand() {
  clearCopyStatus();
  updateSummary();

  const result = buildCommand();
  generatedCommand = result.command;

  if (result.errors.length > 0) {
    commandPreview.textContent = "请修正错误后生成指令。";
    errorBox.innerHTML = result.errors.map((error) => `<div>${error}</div>`).join("");
    errorBox.classList.add("visible");
    copyButton.disabled = true;
    return;
  }

  commandPreview.textContent = generatedCommand;
  errorBox.textContent = "";
  errorBox.classList.remove("visible");
  copyButton.disabled = false;
}

function clearCopyStatus() {
  window.clearTimeout(copyStatusTimer);
  copyStatus.textContent = "";
}

async function copyCommand() {
  if (!generatedCommand) {
    copyStatus.textContent = "无法复制";
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(generatedCommand);
    } else {
      fallbackCopy(generatedCommand);
    }

    copyStatus.textContent = "已复制";
    copyStatusTimer = window.setTimeout(() => {
      copyStatus.textContent = "";
    }, 1600);
  } catch (error) {
    copyStatus.textContent = "复制失败";
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function clearEnchantments() {
  getEnchantmentRows().forEach((row) => row.remove());
  updateEmptyMessage();
  updateCommand();
}

function resetDefault() {
  targetSelect.value = defaultState.target;
  customTargetInput.value = "";
  itemSelect.value = defaultState.item;
  customItemInput.value = "";
  enchantmentList.innerHTML = "";
  addEnchantmentRow(defaultState.enchantment, defaultState.level);
}

function bindGlobalEvents() {
  [targetSelect, customTargetInput, itemSelect, customItemInput].forEach((control) => {
    control.addEventListener("input", updateCommand);
    control.addEventListener("change", updateCommand);
  });

  addEnchantmentButton.addEventListener("click", () => {
    addEnchantmentRow(defaultState.enchantment, defaultState.level);
  });

  clearEnchantmentsButton.addEventListener("click", clearEnchantments);
  resetButton.addEventListener("click", resetDefault);
  copyButton.addEventListener("click", copyCommand);
}

bindGlobalEvents();
addEnchantmentRow(defaultState.enchantment, defaultState.level);

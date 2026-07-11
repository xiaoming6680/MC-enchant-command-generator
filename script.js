const commandVersions = {
  componentShort: {
    label: "Java 1.21.5+",
    description: "新版物品组件简化格式",
    contentVersion: "1.21.5",
    formatCommand({ target, item, quantity, enchantments }) {
      const enchantmentPart = enchantments.length > 0
        ? `[enchantments={${enchantments.map(formatComponentEntry).join(",")}}]`
        : "";

      return `/give ${target} ${item}${enchantmentPart}${formatQuantity(quantity)}`;
    }
  },
  componentLevels: {
    label: "Java 1.20.5 - 1.21.4",
    description: "物品组件 levels 格式",
    contentVersion: "1.20.5",
    formatCommand({ target, item, quantity, enchantments }) {
      const enchantmentPart = enchantments.length > 0
        ? `[enchantments={levels:{${enchantments.map(formatComponentEntry).join(",")}}}]`
        : "";

      return `/give ${target} ${item}${enchantmentPart}${formatQuantity(quantity)}`;
    }
  },
  nbtString: {
    label: "Java 1.13 - 1.20.4",
    description: "NBT 字符串 ID 格式",
    contentVersion: "1.13",
    formatCommand({ target, item, quantity, enchantments }) {
      const nbtPart = enchantments.length > 0
        ? `{Enchantments:[${enchantments.map(formatStringNbtEntry).join(",")}]}`
        : "";

      return `/give ${target} ${item}${nbtPart}${formatQuantity(quantity)}`;
    }
  },
  nbtNumeric: {
    label: "Java 1.8 - 1.12.2",
    description: "旧版数字 ID 与 NBT 格式",
    contentVersion: "1.8",
    formatCommand({ target, item, quantity, enchantments }) {
      const itemId = ensureMinecraftNamespace(item);
      const nbtPart = enchantments.length > 0
        ? ` {ench:[${enchantments.map(formatNumericNbtEntry).join(",")}]}`
        : "";

      const quantityPart = quantity === "1" ? "" : ` ${quantity}`;
      const dataPart = quantity === "1" ? "" : " 0";

      return `/give ${target} ${itemId}${quantityPart}${dataPart}${nbtPart}`;
    }
  }
};

function formatQuantity(quantity) {
  return quantity === "1" ? "" : ` ${quantity}`;
}

const itemGroups = [
  {
    label: "剑",
    options: [
      { id: "wooden_sword", label: "木剑", minVersion: "1.0" },
      { id: "stone_sword", label: "石剑", minVersion: "1.0" },
      { id: "iron_sword", label: "铁剑", minVersion: "1.0" },
      { id: "golden_sword", label: "金剑", minVersion: "1.0" },
      { id: "diamond_sword", label: "钻石剑", minVersion: "1.0" },
      { id: "netherite_sword", label: "下界合金剑", minVersion: "1.16" }
    ]
  },
  {
    label: "斧",
    options: [
      { id: "wooden_axe", label: "木斧", minVersion: "1.0" },
      { id: "stone_axe", label: "石斧", minVersion: "1.0" },
      { id: "iron_axe", label: "铁斧", minVersion: "1.0" },
      { id: "golden_axe", label: "金斧", minVersion: "1.0" },
      { id: "diamond_axe", label: "钻石斧", minVersion: "1.0" },
      { id: "netherite_axe", label: "下界合金斧", minVersion: "1.16" }
    ]
  },
  {
    label: "镐",
    options: [
      { id: "wooden_pickaxe", label: "木镐", minVersion: "1.0" },
      { id: "stone_pickaxe", label: "石镐", minVersion: "1.0" },
      { id: "iron_pickaxe", label: "铁镐", minVersion: "1.0" },
      { id: "golden_pickaxe", label: "金镐", minVersion: "1.0" },
      { id: "diamond_pickaxe", label: "钻石镐", minVersion: "1.0" },
      { id: "netherite_pickaxe", label: "下界合金镐", minVersion: "1.16" }
    ]
  },
  {
    label: "铲",
    options: [
      { id: "wooden_shovel", label: "木铲", minVersion: "1.0" },
      { id: "stone_shovel", label: "石铲", minVersion: "1.0" },
      { id: "iron_shovel", label: "铁铲", minVersion: "1.0" },
      { id: "golden_shovel", label: "金铲", minVersion: "1.0" },
      { id: "diamond_shovel", label: "钻石铲", minVersion: "1.0" },
      { id: "netherite_shovel", label: "下界合金铲", minVersion: "1.16" }
    ]
  },
  {
    label: "锄",
    options: [
      { id: "wooden_hoe", label: "木锄", minVersion: "1.0" },
      { id: "stone_hoe", label: "石锄", minVersion: "1.0" },
      { id: "iron_hoe", label: "铁锄", minVersion: "1.0" },
      { id: "golden_hoe", label: "金锄", minVersion: "1.0" },
      { id: "diamond_hoe", label: "钻石锄", minVersion: "1.0" },
      { id: "netherite_hoe", label: "下界合金锄", minVersion: "1.16" }
    ]
  },
  {
    label: "远程与特殊武器",
    options: [
      { id: "bow", label: "弓", minVersion: "1.0" },
      { id: "trident", label: "三叉戟", minVersion: "1.13" },
      { id: "crossbow", label: "弩", minVersion: "1.14" },
      { id: "mace", label: "重锤", minVersion: "1.21" }
    ]
  },
  {
    label: "实用工具",
    options: [
      { id: "fishing_rod", label: "钓鱼竿", minVersion: "1.0" },
      { id: "shears", label: "剪刀", minVersion: "1.0" },
      { id: "flint_and_steel", label: "打火石", minVersion: "1.0" },
      { id: "shield", label: "盾牌", minVersion: "1.9" },
      { id: "carrot_on_a_stick", label: "胡萝卜钓竿", minVersion: "1.4" },
      { id: "warped_fungus_on_a_stick", label: "诡异菌钓竿", minVersion: "1.16" },
      { id: "brush", label: "刷子", minVersion: "1.20" }
    ]
  }
];

const enchantmentGroups = [
  {
    label: "近战武器",
    options: [
      { id: "sharpness", label: "锋利", minVersion: "1.0", legacyId: 16 },
      { id: "smite", label: "亡灵杀手", minVersion: "1.0", legacyId: 17 },
      { id: "bane_of_arthropods", label: "节肢杀手", minVersion: "1.0", legacyId: 18 },
      { id: "knockback", label: "击退", minVersion: "1.0", legacyId: 19 },
      { id: "fire_aspect", label: "火焰附加", minVersion: "1.0", legacyId: 20 },
      { id: "looting", label: "抢夺", minVersion: "1.0", legacyId: 21 },
      { id: "sweeping_edge", label: "横扫之刃", minVersion: "1.11", legacyId: 22 }
    ]
  },
  {
    label: "工具",
    options: [
      { id: "efficiency", label: "效率", minVersion: "1.0", legacyId: 32 },
      { id: "silk_touch", label: "精准采集", minVersion: "1.0", legacyId: 33 },
      { id: "unbreaking", label: "耐久", minVersion: "1.0", legacyId: 34 },
      { id: "fortune", label: "时运", minVersion: "1.0", legacyId: 35 }
    ]
  },
  {
    label: "弓",
    options: [
      { id: "power", label: "力量", minVersion: "1.0", legacyId: 48 },
      { id: "punch", label: "冲击", minVersion: "1.0", legacyId: 49 },
      { id: "flame", label: "火矢", minVersion: "1.0", legacyId: 50 },
      { id: "infinity", label: "无限", minVersion: "1.0", legacyId: 51 }
    ]
  },
  {
    label: "弩",
    options: [
      { id: "multishot", label: "多重射击", minVersion: "1.14" },
      { id: "piercing", label: "穿透", minVersion: "1.14" },
      { id: "quick_charge", label: "快速装填", minVersion: "1.14" }
    ]
  },
  {
    label: "三叉戟",
    options: [
      { id: "loyalty", label: "忠诚", minVersion: "1.13" },
      { id: "impaling", label: "穿刺", minVersion: "1.13" },
      { id: "riptide", label: "激流", minVersion: "1.13" },
      { id: "channeling", label: "引雷", minVersion: "1.13" }
    ]
  },
  {
    label: "重锤",
    options: [
      { id: "density", label: "密度", minVersion: "1.21" },
      { id: "breach", label: "破甲", minVersion: "1.21" },
      { id: "wind_burst", label: "风爆", minVersion: "1.21" }
    ]
  },
  {
    label: "钓鱼竿",
    options: [
      { id: "luck_of_the_sea", label: "海之眷顾", minVersion: "1.7", legacyId: 61 },
      { id: "lure", label: "饵钓", minVersion: "1.7", legacyId: 62 }
    ]
  },
  {
    label: "通用",
    options: [
      { id: "mending", label: "经验修补", minVersion: "1.9", legacyId: 70 },
      { id: "curse_of_vanishing", label: "消失诅咒", minVersion: "1.11", legacyId: 71 }
    ]
  }
];

const targetGroups = [
  {
    label: "目标选择器",
    options: [
      { id: "@a", label: "所有玩家", minVersion: "1.0" },
      { id: "@p", label: "最近玩家", minVersion: "1.0" },
      { id: "@r", label: "随机玩家", minVersion: "1.0" },
      { id: "@s", label: "自身", minVersion: "1.0" }
    ]
  }
];

const legacyEnchantmentIds = enchantmentGroups
  .flatMap((group) => group.options)
  .reduce((mapping, option) => {
    if (Number.isInteger(option.legacyId)) {
      mapping[option.id] = option.legacyId;
      mapping[`minecraft:${option.id}`] = option.legacyId;
    }

    return mapping;
  }, {});

const defaultState = {
  version: "componentShort",
  target: "",
  item: "",
  quantity: "1",
  enchantment: "sharpness",
  level: "1"
};

const versionSelect = document.getElementById("versionSelect");
const versionDescription = document.getElementById("versionDescription");
const targetCombobox = document.getElementById("targetCombobox");
const itemCombobox = document.getElementById("itemCombobox");
const itemCountInput = document.getElementById("itemCountInput");
const enchantmentList = document.getElementById("enchantmentList");
const addEnchantmentButton = document.getElementById("addEnchantmentButton");
const clearEnchantmentsButton = document.getElementById("clearEnchantmentsButton");
const resetButton = document.getElementById("resetButton");
const commandPreview = document.getElementById("commandPreview");
const errorBox = document.getElementById("errorBox");
const copyButton = document.getElementById("copyButton");
const copyStatus = document.getElementById("copyStatus");
const enchantmentCount = document.getElementById("enchantmentCount");
const versionMeta = document.getElementById("versionMeta");
const targetMeta = document.getElementById("targetMeta");
const itemMeta = document.getElementById("itemMeta");
const enchantMeta = document.getElementById("enchantMeta");

let generatedCommand = "";
let copyStatusTimer = 0;
let hasInteracted = false;
let targetInteracted = false;
let itemInteracted = false;

function interactAndUpdate() {
  hasInteracted = true;
  updateCommand();
}

function interactWithTargetAndUpdate() {
  targetInteracted = true;
  interactAndUpdate();
}

function interactWithItemAndUpdate() {
  itemInteracted = true;
  interactAndUpdate();
}

function parseVersion(value) {
  return value.split(".").map((part) => Number(part));
}

function compareVersions(left, right) {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftValue = leftParts[index] || 0;
    const rightValue = rightParts[index] || 0;

    if (leftValue !== rightValue) {
      return leftValue - rightValue;
    }
  }

  return 0;
}

function isAvailableForVersion(option, version = getVersionConfig()) {
  return compareVersions(version.contentVersion, option.minVersion || "1.0") >= 0;
}

function getAvailableItems() {
  const version = getVersionConfig();
  return itemGroups.flatMap((group) => group.options.filter((option) => isAvailableForVersion(option, version)));
}

function getAvailableEnchantments() {
  const version = getVersionConfig();
  return enchantmentGroups.flatMap((group) => group.options.filter((option) => isAvailableForVersion(option, version)));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getVisibleGroups(groups, query = "") {
  const version = getVersionConfig();
  const normalizedQuery = query.trim().toLowerCase();

  return groups
    .map((group) => ({
      ...group,
      options: group.options.filter((option) => {
        if (!isAvailableForVersion(option, version)) {
          return false;
        }

        return !normalizedQuery
          || option.label.toLowerCase().includes(normalizedQuery)
          || option.id.toLowerCase().includes(normalizedQuery);
      })
    }))
    .filter((group) => group.options.length > 0);
}

function isBuiltInValue(groups, value) {
  return groups.some((group) => group.options.some((option) => option.id === value));
}

function createSearchableCombobox(
  container,
  groups,
  selectedValue,
  onSelect,
  placeholder,
  hideInitialValue = false,
  showPresetLabel = false
) {
  const availableOptions = getVisibleGroups(groups).flatMap((group) => group.options);
  let selectedOption = availableOptions.find((option) => option.id === selectedValue) || availableOptions[0];
  const isInitialized = container.dataset.initialized === "true";
  const shouldHideValue = hideInitialValue && !isInitialized;
  const currentValue = selectedValue === undefined
    ? (selectedOption ? selectedOption.id : "")
    : selectedValue;

  container.classList.add("combobox");
  container.dataset.value = currentValue;
  container.innerHTML = `
    <div class="combobox-control">
      <input class="combobox-input" type="text" role="combobox" aria-expanded="false" aria-autocomplete="list" placeholder="${placeholder}">
      <button class="combobox-toggle" type="button" aria-label="打开选项列表" tabindex="-1"><span class="combobox-chevron" aria-hidden="true"></span></button>
    </div>
    <div class="combobox-menu" role="listbox" hidden></div>
  `;

  const input = container.querySelector(".combobox-input");
  const menu = container.querySelector(".combobox-menu");
  const toggle = container.querySelector(".combobox-toggle");

  const setOpen = (isOpen) => {
    menu.hidden = !isOpen;
    input.setAttribute("aria-expanded", String(isOpen));
    container.classList.toggle("is-open", isOpen);
    container.closest(".enchantment-row")?.classList.toggle("combobox-row-open", isOpen);
  };

  const selectOption = (option) => {
    selectedOption = option;
    container.dataset.value = option.id;
    const displayValue = showPresetLabel ? option.label : option.id;
    container.dataset.displayValue = displayValue;
    input.value = displayValue;
    input.dataset.selectedLabel = option.label;
    setOpen(false);
    onSelect(option.id);
  };

  const renderMenu = (query = "") => {
    const visibleGroups = getVisibleGroups(groups, query);
    menu.innerHTML = visibleGroups.length > 0
      ? visibleGroups.map((group) => `
        <div class="combobox-group" role="presentation">
          <div class="combobox-group-label">${escapeHtml(group.label)}</div>
          ${group.options.map((option) => `
            <button class="combobox-option" type="button" role="option" data-value="${escapeHtml(option.id)}">
              <span>${escapeHtml(option.label)}</span>
              <small>${escapeHtml(option.id)}</small>
            </button>
          `).join("")}
        </div>
      `).join("")
      : '<div class="combobox-empty">没有匹配的选项</div>';

    menu.querySelectorAll(".combobox-option").forEach((optionButton) => {
      optionButton.addEventListener("click", () => {
        const option = availableOptions.find((item) => item.id === optionButton.dataset.value)
          || getVisibleGroups(groups, query).flatMap((group) => group.options).find((item) => item.id === optionButton.dataset.value);
        if (option) {
          selectOption(option);
        }
      });
    });
  };

  const initialDisplayValue = showPresetLabel && selectedOption && selectedOption.id === currentValue
    ? selectedOption.label
    : currentValue;
  input.value = shouldHideValue ? "" : initialDisplayValue;
  container.dataset.displayValue = shouldHideValue ? "" : initialDisplayValue;
  container.dataset.initialized = "true";
  renderMenu();

  input.addEventListener("focus", () => {
    input.select();
    const isSelectedPreset = selectedOption
      && (input.value === selectedOption.id || input.value === selectedOption.label);
    renderMenu(isSelectedPreset ? "" : input.value);
    setOpen(true);
  });
  input.addEventListener("input", () => {
    container.dataset.value = input.value.trim();
    container.dataset.displayValue = input.value;
    onSelect(container.dataset.value);
    renderMenu(input.value);
    setOpen(true);
  });
  input.addEventListener("keydown", (event) => {
    const options = Array.from(menu.querySelectorAll(".combobox-option"));
    const activeIndex = options.findIndex((option) => option.classList.contains("is-active"));

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!options.length) return;
      const nextIndex = event.key === "ArrowDown"
        ? (activeIndex + 1) % options.length
        : (activeIndex - 1 + options.length) % options.length;
      options.forEach((option, index) => option.classList.toggle("is-active", index === nextIndex));
      options[nextIndex].scrollIntoView({ block: "nearest" });
      setOpen(true);
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      options[activeIndex].click();
    }

    if (event.key === "Escape") {
      setOpen(false);
      input.value = container.dataset.displayValue || "";
    }
  });
  toggle.addEventListener("click", () => {
    if (menu.hidden) {
      renderMenu();
      setOpen(true);
      input.focus();
    } else {
      setOpen(false);
    }
  });

  return currentValue;
}

function renderItemOptions(preferredValue = itemCombobox.dataset.value) {
  if (preferredValue === undefined) {
    preferredValue = defaultState.item;
  }

  const availableItems = getAvailableItems();
  const hasPreferredValue = availableItems.some((item) => item.id === preferredValue);
  const hasDefaultValue = availableItems.some((item) => item.id === defaultState.item);
  const isCustomValue = preferredValue && !isBuiltInValue(itemGroups, preferredValue);
  const nextValue = preferredValue === ""
    ? ""
    : hasPreferredValue
    ? preferredValue
    : isCustomValue
      ? preferredValue
    : hasDefaultValue
      ? defaultState.item
      : availableItems[0].id;

  createSearchableCombobox(
    itemCombobox,
    itemGroups,
    nextValue,
    interactWithItemAndUpdate,
    "搜索物品/输入自定义ID",
    true,
    true
  );
}

function createEnchantmentRow(enchantment = defaultState.enchantment, level = defaultState.level) {
  const row = document.createElement("div");
  row.className = "enchantment-row";
  row.dataset.enchantRow = "true";

  row.innerHTML = `
    <label class="field">
      <span class="mobile-label">附魔属性</span>
      <div class="enchantment-combobox"></div>
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

  createSearchableCombobox(
    row.querySelector(".enchantment-combobox"),
    enchantmentGroups,
    enchantment,
    interactAndUpdate,
    "选择附魔/输入自定义附魔",
    true,
    true
  );
  row.querySelector(".level-input").addEventListener("input", interactAndUpdate);
  row.querySelector(".delete-button").addEventListener("click", () => {
    row.remove();
    updateEmptyMessage();
    interactAndUpdate();
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
    message.textContent = "当前没有附魔，生成的指令只会给予未附魔物品。";
    enchantmentList.appendChild(message);
  }

  if (rows.length > 0 && emptyMessage) {
    emptyMessage.remove();
  }
}

function getEnchantmentRows() {
  return Array.from(enchantmentList.querySelectorAll("[data-enchant-row='true']"));
}

function getVersionConfig() {
  return commandVersions[versionSelect.value] || commandVersions[defaultState.version];
}

function syncAvailabilityForVersion() {
  renderItemOptions();

  const availableEnchantments = getAvailableEnchantments();
  const fallbackEnchantment = availableEnchantments[0].id;

  getEnchantmentRows().forEach((row) => {
    const combobox = row.querySelector(".enchantment-combobox");
    const currentValue = combobox.dataset.value;
    const isAvailable = availableEnchantments.some((enchantment) => enchantment.id === currentValue);
    const isCustomValue = currentValue && !isBuiltInValue(enchantmentGroups, currentValue);
    const nextValue = isAvailable
      ? currentValue
      : isCustomValue || currentValue === ""
        ? currentValue
        : fallbackEnchantment;

    createSearchableCombobox(
      combobox,
      enchantmentGroups,
      nextValue,
      interactAndUpdate,
      "选择附魔/输入自定义附魔",
      false,
      true
    );
  });
}

function getTargetValue() {
  return targetCombobox.dataset.value.trim();
}

function getItemValue() {
  return itemCombobox.dataset.value.trim();
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

function ensureMinecraftNamespace(value) {
  return value.includes(":") ? value : `minecraft:${value}`;
}

function stripMinecraftNamespace(value) {
  return value.startsWith("minecraft:") ? value.slice("minecraft:".length) : value;
}

function formatComponentEntry(enchantment) {
  return `${stripMinecraftNamespace(enchantment.id)}:${enchantment.level}`;
}

function formatStringNbtEntry(enchantment) {
  return `{id:"${ensureMinecraftNamespace(enchantment.id)}",lvl:${enchantment.level}s}`;
}

function formatNumericNbtEntry(enchantment) {
  return `{id:${legacyEnchantmentIds[enchantment.id]},lvl:${enchantment.level}s}`;
}

function updateSummary() {
  const rowCount = getEnchantmentRows().length;
  const version = getVersionConfig();
  const target = getTargetValue();
  const item = getItemValue();
  const enchantText = rowCount > 0 ? `${rowCount} 条` : "无";

  versionDescription.textContent = version.description;
  versionMeta.textContent = version.label;
  enchantmentCount.textContent = rowCount > 0 ? `${rowCount} 条附魔` : "0 条附魔";
  targetMeta.textContent = target || "未填写";
  itemMeta.textContent = item || "未填写";
  enchantMeta.textContent = enchantText;
}

function readEnchantments(errors) {
  const enchantments = [];
  const usesNumericNbt = versionSelect.value === "nbtNumeric";

  getEnchantmentRows().forEach((row, index) => {
    const rowNumber = index + 1;
    const enchantmentInput = row.querySelector(".combobox-input");
    const enchantmentId = row.querySelector(".enchantment-combobox").dataset.value.trim();
    const levelInput = row.querySelector(".level-input");
    const levelValue = levelInput.value.trim();
    const enchantmentValueValid = hasNoWhitespace(enchantmentId);
    const levelValid = isPositiveInteger(levelValue);
    const legacyIdValid = !usesNumericNbt || legacyEnchantmentIds[enchantmentId] !== undefined;
    const rowHasError = !enchantmentValueValid || !levelValid || !legacyIdValid;

    setInvalid(enchantmentInput, !enchantmentValueValid || !legacyIdValid);
    setInvalid(levelInput, !levelValid);
    row.classList.toggle("has-error", rowHasError);

    if (!enchantmentValueValid) {
      errors.push(`第 ${rowNumber} 条附魔 ID 不能为空，且不能包含空格。`);
    }

    if (!levelValid) {
      errors.push(`第 ${rowNumber} 条附魔等级必须是大于或等于 1 的正整数。`);
    }

    if (!legacyIdValid) {
      errors.push(`第 ${rowNumber} 条附魔无法用于 Java 1.8 - 1.12.2：旧版格式需要可转换的数字附魔 ID，请选择内置旧版附魔或切换到 Java 1.13+。`);
    }

    if (!rowHasError) {
      enchantments.push({
        id: enchantmentId,
        level: levelValue
      });
    }
  });

  return enchantments;
}

function buildCommand() {
  const validationErrors = [];
  const errors = [];
  const target = getTargetValue();
  const item = getItemValue();
  const quantity = itemCountInput.value.trim();
  const targetValid = hasNoWhitespace(target);
  const itemValid = hasNoWhitespace(item);
  const quantityValid = isPositiveInteger(quantity);
  const version = getVersionConfig();
  const targetError = "目标玩家不能为空，且不能包含空格。";
  const itemError = "物品 ID 不能为空，且不能包含空格。";
  const quantityError = "物品数量必须是大于或等于 1 的正整数。";

  setInvalid(targetCombobox.querySelector(".combobox-input"), targetInteracted && !targetValid);
  setInvalid(itemCombobox.querySelector(".combobox-input"), itemInteracted && !itemValid);
  setInvalid(itemCountInput, !quantityValid);

  if (!targetValid) {
    validationErrors.push(targetError);
    if (targetInteracted) {
      errors.push(targetError);
    }
  }

  if (!itemValid) {
    validationErrors.push(itemError);
    if (itemInteracted) {
      errors.push(itemError);
    }
  }

  if (!quantityValid) {
    validationErrors.push(quantityError);
    errors.push(quantityError);
  }

  const enchantmentErrorStart = validationErrors.length;
  const enchantments = readEnchantments(validationErrors);
  errors.push(...validationErrors.slice(enchantmentErrorStart));

  if (validationErrors.length > 0) {
    return {
      command: "",
      errors,
      hasValidationErrors: true
    };
  }

  return {
    command: version.formatCommand({ target, item, quantity, enchantments }),
    errors: [],
    hasValidationErrors: false
  };
}

function updateCommand() {
  clearCopyStatus();
  updateSummary();

  if (!hasInteracted) {
    generatedCommand = "";
    commandPreview.textContent = "请填写目标玩家和物品 ID 以生成指令。";
    errorBox.textContent = "";
    errorBox.classList.remove("visible");
    copyButton.disabled = true;
    return;
  }

  const result = buildCommand();
  generatedCommand = result.command;

  if (result.hasValidationErrors) {
    commandPreview.textContent = "请修正错误后才可生成指令。";
    if (result.errors.length === 0) {
      commandPreview.textContent = "请填写目标玩家和物品 ID 以生成指令。";
    }
    errorBox.innerHTML = result.errors.map((error) => `<div>${error}</div>`).join("");
    errorBox.classList.toggle("visible", result.errors.length > 0);
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
  interactAndUpdate();
}

function resetDefault() {
  hasInteracted = false;
  targetInteracted = false;
  itemInteracted = false;
  versionSelect.value = defaultState.version;
  createSearchableCombobox(
    targetCombobox,
    targetGroups,
    defaultState.target,
    interactWithTargetAndUpdate,
    "选择目标/输入玩家名称",
    true
  );
  renderItemOptions(defaultState.item);
  itemCountInput.value = defaultState.quantity;
  enchantmentList.innerHTML = "";
  updateEmptyMessage();
  updateCommand();
}

function bindGlobalEvents() {
  versionSelect.addEventListener("change", () => {
    syncAvailabilityForVersion();
    interactAndUpdate();
  });

  addEnchantmentButton.addEventListener("click", () => {
    hasInteracted = true;
    addEnchantmentRow(defaultState.enchantment, defaultState.level);
  });

  clearEnchantmentsButton.addEventListener("click", clearEnchantments);
  resetButton.addEventListener("click", resetDefault);
  copyButton.addEventListener("click", copyCommand);
  itemCountInput.addEventListener("input", interactAndUpdate);

  document.addEventListener("click", (event) => {
    document.querySelectorAll(".combobox.is-open").forEach((combobox) => {
      if (!combobox.contains(event.target)) {
        combobox.querySelector(".combobox-menu").hidden = true;
        combobox.querySelector(".combobox-input").setAttribute("aria-expanded", "false");
        combobox.querySelector(".combobox-input").value = combobox.dataset.displayValue || "";
        combobox.classList.remove("is-open");
        combobox.closest(".enchantment-row")?.classList.remove("combobox-row-open");
      }
    });
  });
}

createSearchableCombobox(
  targetCombobox,
  targetGroups,
  defaultState.target,
  interactWithTargetAndUpdate,
  "选择目标/输入玩家名称",
  true
);
renderItemOptions(defaultState.item);
bindGlobalEvents();
updateEmptyMessage();
updateCommand();

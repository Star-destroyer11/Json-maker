let allItems = [];
let inventory = {
  items: []
};
let advancedMode = false;
let stackingMode = false;
let selectedContainerId = 'root';

const ammoConfig = {
  "item_revolver_gold": 6,
  "item_revolver": 6,
  "item_rpg": 1,
  "item_rpg_cny": 1,
  "item_shotgun": 2,
  "item_flaregun": 1,
  "item_zipline_gun": 1,
};

document.addEventListener('DOMContentLoaded', () => {
  fetch('files.json')
    .then(res => res.json())
    .then(data => {
      allItems = data;
      updateItemSelect();
    })
    .catch(err => console.error("Failed to load items:", err));
  
  document.getElementById("addItem").addEventListener("click", addItemToInventory);
  document.getElementById("downloadJson").addEventListener("click", downloadJson);
  document.getElementById("advancedMode").addEventListener("click", toggleAdvancedMode);
  document.getElementById("searchInput").addEventListener("input", function () {
    const searchText = this.value.trim().toLowerCase();
    const searchSuggestions = document.getElementById("searchSuggestions");

    if (searchText === "") {
      searchSuggestions.innerHTML = "";
      searchSuggestions.classList.remove("active");
      updateInventoryTree();
      return;
    }

    const filteredItems = allItems.filter(item =>
      item.name.toLowerCase().includes(searchText) || item.id.toLowerCase().includes(searchText)
    );

    if (filteredItems.length > 0) {
      searchSuggestions.innerHTML = filteredItems
        .map(item => `<div class="suggestion-item" data-item-id="${item.id}">${item.name}</div>`)
        .join("");
      searchSuggestions.classList.add("active");
    } else {
      searchSuggestions.innerHTML = "<div class='suggestion-item'>No results found</div>";
      searchSuggestions.classList.add("active");
    }
  });

  document.getElementById("searchSuggestions").addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("suggestion-item") && target.dataset.itemId) {
      const selectedItemId = target.dataset.itemId;
      const itemSelect = document.getElementById("itemSelect");

      itemSelect.value = selectedItemId;
      searchSuggestions.innerHTML = "";
      searchSuggestions.classList.remove("active");

      updateInventoryTree();
    }
  });
  
  document.getElementById("containerSelect").addEventListener("change", (e) => {
    selectedContainerId = e.target.value;
  });
  document.getElementById("diamondMode").addEventListener("change", handleDiamondToggle);
  document.getElementById("diamondMode2").addEventListener("change", handleDiamondToggle2);
  document.getElementById("rubyMode").addEventListener("change", handleRubyToggle);
  document.getElementById("goldMode").addEventListener("change", handleGoldToggle);
  document.getElementById("galaxyMode2").addEventListener("change", handleGalaxyToggle2);
  document.getElementById("galaxyMode").addEventListener("change", handleGalaxyToggle);
  document.getElementById("filterMode").addEventListener("change", updateItemSelect);

  document.getElementById("importJson").addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target.result);
            if (jsonData && jsonData.objects && jsonData.objects[0] && jsonData.objects[0].value) {
              const inventoryData = JSON.parse(jsonData.objects[0].value);
              if (inventoryData && inventoryData.items) {
                inventory.items = inventoryData.items;
                updateInventoryTree();
                alert("JSON imported successfully!");
              } else {
                alert("Invalid JSON structure: Missing 'items' key.");
              }
            } else {
              alert("Invalid JSON structure.");
            }
          } catch (error) {
            alert("Error parsing JSON file.");
          }
        };
        reader.readAsText(file);
      }
    });

    input.click();
  });

  const itemSelect = document.getElementById("itemSelect");
  const filterModeContainer = document.getElementById("filterModeContainer");

  const toggleFilterModeVisibility = () => {
    if (itemSelect.value === "random") {
      filterModeContainer.style.display = "block";
    } else {
      filterModeContainer.style.display = "none";
    }
  };

  toggleFilterModeVisibility();

  itemSelect.addEventListener("change", toggleFilterModeVisibility);

  document.getElementById("itemSelect").addEventListener("change", function () {
    const selectedItem = this.value;
    const valueSliderContainer = document.getElementById("valueSliderContainer");
    const ammoSliderContainer = document.getElementById("ammoSliderContainer");

    if (selectedItem === "item_shredder") {
      valueSliderContainer.style.display = "block";
    } else {
      valueSliderContainer.style.display = "none";
    }

    if (ammoConfig[selectedItem]) {
      ammoSliderContainer.style.display = "block";
      const ammoSlider = document.getElementById("ammoSlider");
      const ammoInput = document.getElementById("ammoInput");
      ammoSlider.max = ammoConfig[selectedItem];
      ammoInput.max = ammoConfig[selectedItem];
      ammoSlider.value = ammoConfig[selectedItem];
      ammoInput.value = ammoConfig[selectedItem];
    } else {
      ammoSliderContainer.style.display = "none";
    }
  });

  const valueSlider = document.getElementById("valueSlider");
  const valueInput = document.getElementById("valueInput");

  valueSlider.addEventListener("input", function () {
    valueInput.value = this.value;
  });

  valueInput.addEventListener("input", function () {
    const value = Math.min(Math.max(this.value, valueSlider.min), valueSlider.max);
    valueSlider.value = value;
    this.value = value;
  });

function handleGoldToggle() {
  const goldEnabled = document.getElementById("goldMode").checked;
  const hueSlider = document.getElementById("hue");
  const hueDisplay = document.getElementById("hueValue");
  const saturationSlider = document.getElementById("saturation");
  const saturationDisplay = document.getElementById("saturationValue");

  hueSlider.disabled = goldEnabled;
  saturationSlider.disabled = goldEnabled;
  document.getElementById("randomHue").disabled = goldEnabled;
  document.getElementById("randomSaturation").disabled = goldEnabled;
  document.getElementById("sameRandomHue").disabled = goldEnabled;
  document.getElementById("sameRandomSaturation").disabled = goldEnabled;

  if (goldEnabled) {
    hueSlider.value = 45;
    hueDisplay.value = "45";
    saturationSlider.value = 120;
    saturationDisplay.value = "120";
  }
}


function handleRubyToggle() {
  const rubyEnabled = document.getElementById("rubyMode").checked;
  const hueSlider = document.getElementById("hue");
  const hueDisplay = document.getElementById("hueValue");
  const saturationSlider = document.getElementById("saturation");
  const saturationDisplay = document.getElementById("saturationValue");

  hueSlider.disabled = rubyEnabled;
  saturationSlider.disabled = rubyEnabled;
  document.getElementById("randomHue").disabled = rubyEnabled;
  document.getElementById("randomSaturation").disabled = rubyEnabled;
  document.getElementById("sameRandomHue").disabled = rubyEnabled;
  document.getElementById("sameRandomSaturation").disabled = rubyEnabled;

  if (rubyEnabled) {
    hueSlider.value = 0;
    hueDisplay.value = "0";
    saturationSlider.value = 120;
    saturationDisplay.value = "120";
  }
}

 function handleDiamondToggle2() {
    const diamondEnabled2 = document.getElementById("diamondMode2").checked;
    const hueSlider = document.getElementById("hue");
    const hueDisplay = document.getElementById("hueValue");
    const saturationSlider = document.getElementById("saturation");
    const saturationDisplay = document.getElementById("saturationValue");
    
    hueSlider.disabled = diamondEnabled2;
    saturationSlider.disabled = diamondEnabled2;
    document.getElementById("randomHue").disabled = diamondEnabled2;
    document.getElementById("randomSaturation").disabled = diamondEnabled2;
    document.getElementById("sameRandomHue").disabled = diamondEnabled2;
    document.getElementById("sameRandomSaturation").disabled = diamondEnabled2;

    if (diamondEnabled2) {
      hueSlider.value = 90;
      hueDisplay.value = "90";
      saturationSlider.value = 120;
      saturationDisplay.value = "120";
    }
  }

 function handleDiamondToggle() {
    const diamondEnabled = document.getElementById("diamondMode").checked;
    const hueSlider = document.getElementById("hue");
    const hueDisplay = document.getElementById("hueValue");
    const saturationSlider = document.getElementById("saturation");
    const saturationDisplay = document.getElementById("saturationValue");
    
    hueSlider.disabled = diamondEnabled;
    saturationSlider.disabled = diamondEnabled;
    document.getElementById("randomHue").disabled = diamondEnabled;
    document.getElementById("randomSaturation").disabled = diamondEnabled;
    document.getElementById("sameRandomHue").disabled = diamondEnabled;
    document.getElementById("sameRandomSaturation").disabled = diamondEnabled;

    if (diamondEnabled) {
      hueSlider.value = 120;
      hueDisplay.value = "120";
      saturationSlider.value = 120;
      saturationDisplay.value = "120";
    }
  }

  function handleGalaxyToggle2() {
    const galaxyEnabled2 = document.getElementById("galaxyMode2").checked;
    const hueSlider = document.getElementById("hue");
    const hueDisplay = document.getElementById("hueValue");
    const saturationSlider = document.getElementById("saturation");
    const saturationDisplay = document.getElementById("saturationValue");
    
    hueSlider.disabled = galaxyEnabled2;
    saturationSlider.disabled = galaxyEnabled2;
    document.getElementById("randomHue").disabled = galaxyEnabled2;
    document.getElementById("randomSaturation").disabled = galaxyEnabled2;
    document.getElementById("sameRandomHue").disabled = galaxyEnabled2;
    document.getElementById("sameRandomSaturation").disabled = galaxyEnabled2;

    if (galaxyEnabled2) {
      hueSlider.value = 180;
      hueDisplay.value = "180";
      saturationSlider.value = 117;
      saturationDisplay.value = "117";
    }
  }

  function handleGalaxyToggle() {
    const galaxyEnabled = document.getElementById("galaxyMode").checked;
    const hueSlider = document.getElementById("hue");
    const hueDisplay = document.getElementById("hueValue");
    const saturationSlider = document.getElementById("saturation");
    const saturationDisplay = document.getElementById("saturationValue");
    
    hueSlider.disabled = galaxyEnabled;
    saturationSlider.disabled = galaxyEnabled;
    document.getElementById("randomHue").disabled = galaxyEnabled;
    document.getElementById("randomSaturation").disabled = galaxyEnabled;
    document.getElementById("sameRandomHue").disabled = galaxyEnabled;
    document.getElementById("sameRandomSaturation").disabled = galaxyEnabled;

    if (galaxyEnabled) {
      hueSlider.value = 161;
      hueDisplay.value = "161";
      saturationSlider.value = 120;
      saturationDisplay.value = "120";
    }
  }

  
  setupRandomOptionVisibility("randomHue", "randomHueToggleWrap");
  setupRandomOptionVisibility("randomSaturation", "randomSaturationToggleWrap");
  setupRandomOptionVisibility("randomSize", "randomSizeToggleWrap");

  updateItemSelect();

  const stackModeBtn = document.getElementById("stackMode");

  stackModeBtn.addEventListener("click", () => {
    stackingMode = !stackingMode;
    stackModeBtn.textContent = `Stacking: ${stackingMode ? "On" : "Off"}`;
    stackModeBtn.classList.toggle("active", stackingMode);

    updateInventoryTree();
  });
});

function setupRandomOptionVisibility(checkboxId, toggleWrapperId) {
  const checkbox = document.getElementById(checkboxId);
  const toggleWrap = document.getElementById(toggleWrapperId);
  
  toggleWrap.style.display = checkbox.checked ? "block" : "none";
  
  checkbox.addEventListener("change", function() {
    toggleWrap.style.display = this.checked ? "block" : "none";
  });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toggleAdvancedMode() {
  advancedMode = !advancedMode;
  const advancedModeBtn = document.getElementById("advancedMode");
  
  if (advancedMode) {
    advancedModeBtn.textContent = "Advanced Mode";
    advancedModeBtn.classList.add("advanced");
  } else {
    advancedModeBtn.textContent = "Basic Mode";
    advancedModeBtn.classList.remove("advanced");
  }
  
  document.querySelectorAll('.item-id').forEach(el => {
    if (advancedMode) {
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
    }
  });
}

const setupSlider = (sliderId, valueId) => {
  const slider = document.getElementById(sliderId);
  const valueInput = document.getElementById(valueId);

  valueInput.value = slider.value;

  slider.addEventListener('input', function () {
    valueInput.value = this.value;
  });

  valueInput.addEventListener('input', function () {
    const value = Math.min(Math.max(this.value, slider.min), slider.max);
    slider.value = value;
    this.value = value; 
  });
};

setupSlider('hue', 'hueValue');
setupSlider('saturation', 'saturationValue');
setupSlider('size', 'sizeValue');

function updateColorDisplay() {
  const hue = parseInt(document.getElementById("hue").value, 10) || 0
  const saturation = parseInt(document.getElementById("saturation").value, 10) || 0
  const normalizedSaturation = (saturation / 120) * 100
  const adjustedHue = (hue / 210) * 300 // Map 0–210 to 0–240 for blue-purple tones when galaxy, this is where im orienting from but this wont really ever work cause its not texture based so idk lol
  const lightness = 50
  const colorDisplay = document.getElementById("colorDisplay")
  colorDisplay.style.backgroundColor = `hsl(${adjustedHue}, ${normalizedSaturation}%, ${lightness}%)`
}

document.getElementById("hue").addEventListener("input", updateColorDisplay)
document.getElementById("saturation").addEventListener("input", updateColorDisplay)
document.getElementById("galaxyMode").addEventListener("change", () => {
  updateColorDisplay()
})

updateColorDisplay()

function handleSearch() {
  const searchText = document.getElementById("searchInput").value.toLowerCase();
  const suggestionsContainer = document.getElementById("searchSuggestions");
  
  if (searchText.length > 0) {
    const matchingItems = allItems
      .filter(item => 
        item.name.toLowerCase().includes(searchText) || 
        item.id.toLowerCase().includes(searchText))
      .slice(0, 5);
      
    suggestionsContainer.innerHTML = '';
    
    if (matchingItems.length > 0) {
      suggestionsContainer.classList.add('active');
      
      matchingItems.forEach(item => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.innerHTML = `
          <div class="item-name">${item.name}</div>
          <div class="item-id ${advancedMode ? 'visible' : ''}">${item.id}</div>
        `;
        
        suggestionItem.addEventListener('click', () => {
          document.getElementById('itemSelect').value = item.id;
          suggestionsContainer.classList.remove('active');
          document.getElementById('searchInput').value = '';
          
          document.getElementById('itemSelect').dispatchEvent(new Event('change'));
        });
        
        suggestionsContainer.appendChild(suggestionItem);
      });
    } else {
      suggestionsContainer.classList.remove('active');
    }
  } else {
    suggestionsContainer.classList.remove('active');
  }
  
  filterInventoryTree(searchText);
}

function filterInventoryTree(searchText) {
  const treeItems = document.querySelectorAll('#inventoryTree li');
  
  treeItems.forEach(item => {
    const itemName = item.getAttribute('data-name').toLowerCase();
    const itemId = item.getAttribute('data-item-id').toLowerCase();
    
    if (!searchText || itemName.includes(searchText) || itemId.includes(searchText)) {
      item.classList.remove('hidden');
      
      let parent = item.parentElement;
      while (parent && parent.classList.contains('child-items')) {
        parent.classList.add('expanded');
        parent = parent.parentElement.parentElement;
      }
    } else {
      const hasVisibleChildren = Array.from(item.querySelectorAll('li'))
        .some(child => !child.classList.contains('hidden'));
      
      if (!hasVisibleChildren) {
        item.classList.add('hidden');
      } else {
        item.classList.remove('hidden');
      }
    }
  });
}

function addItemToInventory() {
  const itemID = document.getElementById("itemSelect").value;
  const count = parseInt(document.getElementById("count").value, 10) || 1;
  const containerSelection = document.getElementById("containerSelect").value;

  const galaxyMode = document.getElementById("galaxyMode").checked;

  const randomHue = document.getElementById("randomHue").checked;
  const randomSaturation = document.getElementById("randomSaturation").checked;
  const randomSize = document.getElementById("randomSize").checked;

  const sameRandomHue = document.getElementById("sameRandomHue").checked;
  const sameRandomSaturation = document.getElementById("sameRandomSaturation").checked;
  const sameRandomSize = document.getElementById("sameRandomSize").checked;

  const hueVal = galaxyMode ? 161 : parseInt(document.getElementById("hue").value) || 0;
  const satVal = galaxyMode ? 120 : parseInt(document.getElementById("saturation").value) || 0;
  const sizeVal = parseInt(document.getElementById("size").value) || 0;

  const sharedRandomHue = (galaxyMode || !randomHue) ? hueVal : getRandomInt(0, 255);
  const sharedRandomSaturation = (galaxyMode || !randomSaturation) ? satVal : getRandomInt(0, 100);
  const sharedRandomSize = randomSize ? getRandomInt(-100, 100) : sizeVal;

  for (let i = 0; i < count; i++) {
    let selectedItemID = itemID;

    if (itemID === "random") {
      const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
      selectedItemID = randomItem.id;

      if (ammoConfig[selectedItemID]) {
        const ammoSlider = document.getElementById("ammoSlider");
        const ammoInput = document.getElementById("ammoInput");
        ammoSlider.value = ammoConfig[selectedItemID];
        ammoInput.value = ammoConfig[selectedItemID];
      }
    } else if (itemID === "randomContainer") {
      const containers = allItems.filter(item => isContainer(item, item.id));
      const randomContainer = containers[Math.floor(Math.random() * containers.length)];
      selectedItemID = randomContainer ? randomContainer.id : null;
    } else if (itemID === "randomItem") {
      const items = allItems.filter(item => !isContainer(item, item.id));
      const randomItem = items[Math.floor(Math.random() * items.length)];
      selectedItemID = randomItem ? randomItem.id : null;

      if (ammoConfig[selectedItemID]) {
        const ammoSlider = document.getElementById("ammoSlider");
        const ammoInput = document.getElementById("ammoInput");
        ammoSlider.value = ammoConfig[selectedItemID];
        ammoInput.value = ammoConfig[selectedItemID];
      }
    }

    if (!selectedItemID) {
      alert("No valid item found for the selected option.");
      continue;
    }

    const newItem = {
      itemID: selectedItemID,
      colorHue: galaxyMode
        ? 161
        : (randomHue ? (sameRandomHue ? sharedRandomHue : getRandomInt(0, 255)) : hueVal),
      colorSaturation: galaxyMode
        ? 120
        : (randomSaturation ? (sameRandomSaturation ? sharedRandomSaturation : getRandomInt(0, 100)) : satVal),
      scaleModifier: randomSize
        ? (sameRandomSize ? sharedRandomSize : getRandomInt(-100, 100))
        : sizeVal,
      count: 1
    };

    if (ammoConfig[selectedItemID]) {
      newItem.ammo = ammoConfig[selectedItemID];
    }

    if (containerSelection === 'root') {
      const existingItem = findExistingItem(inventory.items, newItem);
      if (existingItem) {
        existingItem.count = (existingItem.count || 1) + 1;
      } else {
        inventory.items.push(newItem);
      }
    } else {
      try {
        const containerPath = JSON.parse(containerSelection);

        if (containerPath.length === 0) {
          inventory.items.push(newItem);
        } else {
          const immContainerId = containerPath[0];
          const remainingPath = containerPath.slice(1);

          addToContainer(inventory.items, immContainerId, newItem, remainingPath);
        }
      } catch (e) {
        console.error("Error parsing container path:", e);
        inventory.items.push(newItem);
      }
    }
  }

  updateInventoryTree();
  updateJsonSizeIndicator();
}

function findExistingItem(items, newItem) {
  if (stackingMode) {
    return items.find(item => item.itemID === newItem.itemID);
  }
  return items.find(item =>
    item.itemID === newItem.itemID &&
    item.colorHue === newItem.colorHue &&
    item.colorSaturation === newItem.colorSaturation &&
    item.scaleModifier === newItem.scaleModifier
  );
}

function addToContainer(items, containerID, newItem, containerPath = []) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    

    if (item.itemID === containerID) {
      if (containerPath.length === 0) {
        if (!item.children) {
          item.children = [];
        }

        const existingItem = findExistingItem(item.children, newItem);
        if (existingItem) {
          existingItem.count = (existingItem.count || 1) + 1;
        } else {
          item.children.push(newItem);
        }
        return true;
      } else {
        const nextPathItem = containerPath[0];
        const remainingPath = containerPath.slice(1);
        
        if (item.children) {
          for (let j = 0; j < item.children.length; j++) {
            if (item.children[j].itemID === nextPathItem) {
              return addToContainer([item.children[j]], nextPathItem, newItem, remainingPath);
            }
          }
        }
      }
    }

    if (item.children && item.children.length > 0) {
      const added = addToContainer(item.children, containerID, newItem, containerPath);
      if (added) {
        return true;
      }
    }
  }

  return false;
}


function isContainer(itemData, itemID) {
  if (!itemData) return false;
  
  return (
    itemData.category === "Bags" || 
    itemID.toLowerCase().includes("backpack") ||
    itemID.toLowerCase().includes("crossbow") ||
    itemData.name.toLowerCase().includes("crossbow")
  );
}

function updateInventoryTree() {
  const inventoryTree = document.getElementById("inventoryTree");

  const expandedContainers = new Set();
  inventoryTree.querySelectorAll('.child-items.expanded').forEach(container => {
    const parentItem = container.parentElement;
    if (parentItem && parentItem.dataset.itemId) {
      expandedContainers.add(parentItem.dataset.itemId);
    }
  });

  inventoryTree.innerHTML = '';

  updateContainerSelect();

  inventory.items.forEach(item => {
    renderInventoryItem(item, inventoryTree);
  });

  inventoryTree.querySelectorAll('li').forEach(item => {
    if (expandedContainers.has(item.dataset.itemId)) {
      const childContainer = item.querySelector('.child-items');
      if (childContainer) {
        childContainer.classList.add('expanded');
        const toggle = item.querySelector('.tree-toggle');
        if (toggle) {
          toggle.textContent = "▼";
        }
      }
    }
  });

  updateJsonSizeIndicator();
}

function updateContainerSelect() {
  const containerSelect = document.getElementById("containerSelect");
  containerSelect.innerHTML = '<option value="root">Root (No Container)</option>';
  
  const addContainers = (items, path = [], displayPath = "") => {
    items.forEach(item => {
      const itemData = allItems.find(i => i.id === item.itemID);
      
      if (isContainer(itemData, item.itemID)) {
        const name = itemData ? itemData.name : item.itemID;
        const pathDisplay = displayPath ? `${displayPath} > ${name}` : name;
        const containerPathVal = JSON.stringify([...path, item.itemID]);
        
        const option = document.createElement("option");
        option.value = containerPathVal;
        option.textContent = pathDisplay;
        option.dataset.itemId = item.itemID;
        option.dataset.path = containerPathVal;
        containerSelect.appendChild(option);
        
        if (item.children && item.children.length > 0) {
          const newPath = [...path, item.itemID];
          const newDisplayPath = pathDisplay;
          addContainers(item.children, newPath, newDisplayPath);
        }
      }
    });
  };
  
  addContainers(inventory.items);
  
  if (selectedContainerId && selectedContainerId !== 'root') {
    const exists = Array.from(containerSelect.options).some(option => {
      return option.dataset.path === selectedContainerId;
    });
    
    if (exists) {
      containerSelect.value = selectedContainerId;
    } else {
      selectedContainerId = 'root';
      containerSelect.value = 'root';
    }
  }
}

function renderInventoryItem(item, parentElement, level = 0) {
  const itemData = allItems.find(i => i.id === item.itemID);
  const itemName = itemData ? itemData.name : item.itemID;

  const li = document.createElement("li");
  li.dataset.itemId = item.itemID;
  li.dataset.name = itemName;

  const isContainerItem = isContainer(itemData, item.itemID);
  const hasChildren = item.children && item.children.length > 0;

  const treeItem = document.createElement("div");
  treeItem.className = `tree-item ${isContainerItem ? 'container' : ''}`;

  const treeItemInfo = document.createElement("div");
  treeItemInfo.className = "tree-item-info";

  if (isContainerItem || hasChildren) {
    const toggle = document.createElement("span");
    toggle.className = "tree-toggle";
    toggle.textContent = "►";
    toggle.addEventListener("click", () => {
      const childContainer = li.querySelector('.child-items');
      if (childContainer.classList.contains('expanded')) {
        childContainer.classList.remove('expanded');
        toggle.textContent = "►";
      } else {
        childContainer.classList.add('expanded');
        toggle.textContent = "▼";
      }
    });
    treeItemInfo.appendChild(toggle);
  }

  const itemContent = document.createElement("div");
  itemContent.className = "tree-item-content";

  const countDisplay = item.count && item.count > 1 ? ` (x${item.count})` : '';

  itemContent.innerHTML = `
    <span>${itemName}${countDisplay}</span>
    <span class="item-id ${advancedMode ? 'visible' : ''}">(${item.itemID})</span>
    ${hasChildren ? `<span class="item-count">${item.children.length} items</span>` : ''}
  `;

  const attributes = [];
  if (item.colorHue !== undefined && item.colorHue !== 0) attributes.push(`Hue: ${item.colorHue}`);
  if (item.colorSaturation !== undefined && item.colorSaturation !== 0) attributes.push(`Saturation: ${item.colorSaturation}`);
  if (item.scaleModifier !== undefined && item.scaleModifier !== 0) attributes.push(`Size: ${item.scaleModifier}`);
  if (item.ammo !== undefined && item.ammo !== 0) attributes.push(`Ammo: ${item.ammo}`);

  if (attributes.length > 0) {
    const propsTable = document.createElement("table");
    propsTable.className = "properties-table";
    propsTable.innerHTML = `
      <tr>${attributes.map(attr => `<td>${attr}</td>`).join('')}</tr>
    `;
    itemContent.appendChild(propsTable);
  }

  treeItemInfo.appendChild(itemContent);
  treeItem.appendChild(treeItemInfo);

  const actionDiv = document.createElement("div");
  actionDiv.className = "item-actions";

  if (level > 0) {
    const moveUpBtn = document.createElement("button");
    moveUpBtn.textContent = "Move Up";
    moveUpBtn.addEventListener("click", () => {
      moveItemUp(item, level);
    });
    actionDiv.appendChild(moveUpBtn);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    deleteItem(item, level);
  });
  actionDiv.appendChild(deleteBtn);

  treeItem.appendChild(actionDiv);
  li.appendChild(treeItem);

  if (isContainerItem || hasChildren) {
    const childContainer = document.createElement("ul");
    childContainer.className = "child-items";
    li.appendChild(childContainer);

    if (item.children && item.children.length > 0) {
      item.children.forEach(child => {
        renderInventoryItem(child, childContainer, level + 1);
      });
    }
  }

  parentElement.appendChild(li);
}

function moveItemUp(item, level) {
  const findItemAndParent = (items, targetItem, parentArray = null) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i] === targetItem) {
        return { item: items[i], parent: items, index: i, parentArray };
      }
      
      if (items[i].children && items[i].children.length > 0) {
        const result = findItemAndParent(items[i].children, targetItem, items[i]);
        if (result) return result;
      }
    }
    return null;
  };
  
  const itemInfo = findItemAndParent(inventory.items, item);
  
  if (itemInfo && itemInfo.parentArray) {
    itemInfo.parent.splice(itemInfo.index, 1);
    
    const findParentArray = (items, targetArray) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].children === targetArray) {
          return { parent: items, index: i };
        }
        
        if (items[i].children && items[i].children.length > 0) {
          const result = findParentArray(items[i].children, targetArray);
          if (result) return result;
        }
      }
      return null;
    };
    
    const grandparentInfo = findParentArray(inventory.items, itemInfo.parent);
    
    if (grandparentInfo) {
      const existingItem = findExistingItem(grandparentInfo.parent, item);
      if (existingItem) {
        existingItem.count = (existingItem.count || 1) + (item.count || 1);
      } else {
        grandparentInfo.parent.push(item);
      }
    } else {
      const existingItem = findExistingItem(inventory.items, item);
      if (existingItem) {
        existingItem.count = (existingItem.count || 1) + (item.count || 1);
      } else {
        inventory.items.push(item);
      }
    }
    
    updateInventoryTree();
  }
}

function deleteItem(targetItem, level = 0) {
  const removeItem = (items, item) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i] === item) {
        items.splice(i, 1);
        return true;
      }
      
      if (items[i].children && items[i].children.length > 0) {
        if (removeItem(items[i].children, item)) {
          return true;
        }
      }
    }
    return false;
  };
  
  removeItem(inventory.items, targetItem);
  updateInventoryTree();
}

function downloadJson() {
  const fileTitleInput = document.getElementById("fileTitle");
  const fileTitle = fileTitleInput.value.trim() || "custom_inventory";

  const processItemsForOutput = (items) => {
    return items.map(item => {
      const processedItem = { ...item };
      const count = processedItem.count || 1;
      delete processedItem.count;

      if (processedItem.itemID === "item_shredder") {
        const value = parseInt(document.getElementById("valueSlider").value, 10) || 20;
        processedItem.state = value - 20;
      }

      if (processedItem.colorHue === 0) delete processedItem.colorHue;
      if (processedItem.colorSaturation === 0) delete processedItem.colorSaturation;
      if (processedItem.scaleModifier === 0) delete processedItem.scaleModifier;
      if (processedItem.ammo === 0) delete processedItem.ammo;

      if (processedItem.children && processedItem.children.length > 0) {
        processedItem.children = processItemsForOutput(processedItem.children);
      }

      if (count === 1) {
        return processedItem;
      } else {
        return Array(count).fill().map(() => JSON.parse(JSON.stringify(processedItem)));
      }
    }).flat();
  };

  const processedItems = processItemsForOutput(inventory.items);

  const outputInventory = {
    version: 1,
    items: processedItems
  };

  const jsonOutput = {
    objects: [
      {
        collection: "user_inventory",
        key: "stash",
        permission_read: 1,
        permission_write: 1,
        value: JSON.stringify(outputInventory)
      }
    ]
  };

  const jsonString = JSON.stringify(jsonOutput, null, 2).replace(/,\s*}/g, '}');
  const blob = new Blob([jsonString], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileTitle}.json`;
  link.click();
}

function updateItemSelect() {
  const itemSelect = document.getElementById("itemSelect");

  itemSelect.innerHTML = '';

  const randomOption = document.createElement("option");
  randomOption.value = "random";
  randomOption.textContent = "Random (All)";
  itemSelect.appendChild(randomOption);

  const randomContainerOption = document.createElement("option");
  randomContainerOption.value = "randomContainer";
  randomContainerOption.textContent = "Container (Random Container)";
  itemSelect.appendChild(randomContainerOption);

  const randomItemOption = document.createElement("option");
  randomItemOption.value = "randomItem";
  randomItemOption.textContent = "Item (Random Item)";
  itemSelect.appendChild(randomItemOption);

  if (!allItems || allItems.length === 0) {
    console.error("No items found in the JSON file.");
    return;
  }

  allItems.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    itemSelect.appendChild(option);
  });
}

document.getElementById("filterMode").addEventListener("change", updateItemSelect);

function updateJsonSizeIndicator() {
  const jsonSizeIndicator = document.getElementById("jsonSizeIndicator");

  const processItemsForOutput = (items) => {
    return items.map(item => {
      const processedItem = { ...item };
      const count = processedItem.count || 1;
      delete processedItem.count;

      if (processedItem.children && processedItem.children.length > 0) {
        processedItem.children = processItemsForOutput(processedItem.children);
      }

      if (count === 1) {
        return processedItem;
      } else {
        return Array(count).fill().map(() => JSON.parse(JSON.stringify(processedItem)));
      }
    }).flat();
  };

  const processedItems = processItemsForOutput(inventory.items);

  const outputInventory = {
    version: 1,
    items: processedItems
  };

  const jsonOutput = {
    objects: [
      {
        collection: "user_inventory",
        key: "stash",
        permission_read: 1,
        permission_write: 1,
        value: JSON.stringify(outputInventory)
      }
    ]
  };

  const jsonString = JSON.stringify(jsonOutput);
  const jsonSizeKB = (new Blob([jsonString]).size / 1024).toFixed(2);

  jsonSizeIndicator.textContent = `JSON Size: ${jsonSizeKB} KB`;
  if (jsonSizeKB > 250) {
    jsonSizeIndicator.classList.add("warning");
    jsonSizeIndicator.textContent += " - Loading won't work, you are above 300 KB";
  } else {
    jsonSizeIndicator.classList.remove("warning");
  }
}

updateJsonSizeIndicator();

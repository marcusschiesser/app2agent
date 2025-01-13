import { generateXPath, getElementByXpath } from "./xpath";

/**
 * Programmatically get the form tree and return a formatted input tree
 * The tree elements should be in the following format:
 * element(xpath, current value)
 *
 * E.g:
 * form(//*[@id="login"])
 * |-- input(//*[@id="username"], "example@gmail.com")
 * |-- input(//*[@id="password"], "********")
 *
 * form(//*[@id="search"])
 * |-- input(//*[@id="query"], "search term")
 * |-- select(//*[@id="category"], "Latest")
 * |   |-- option(//*[@id="category"]/option[1], "Latest")
 * |   |-- option(//*[@id="category"]/option[2], "Top")
 * |-- textarea(//*[@id="description"], "")
 *
 * @param dom - The DOM to construct the input tree from
 * @returns The input tree
 */
export function programmaticGetFormTree(dom: Document): string {
  let result = "";

  // Helper function to generate XPath for an element
  function generateXPath(element: Element): string {
    if (!element.parentElement) {
      return "//" + element.tagName.toLowerCase();
    }

    // If element has ID, use it
    if (element.id) {
      return `//*[@id="${element.id}"]`;
    }

    // Get all siblings of the same type
    const siblings = Array.from(element.parentElement.children).filter(
      (child) => child.tagName === element.tagName,
    );

    // If element is unique among siblings, construct simple path
    if (siblings.length === 1) {
      return (
        generateXPath(element.parentElement) +
        "/" +
        element.tagName.toLowerCase()
      );
    }

    // Find position among siblings of same type
    const index = siblings.indexOf(element) + 1;
    return (
      generateXPath(element.parentElement) +
      "/" +
      element.tagName.toLowerCase() +
      "[" +
      index +
      "]"
    );
  }

  // Helper function to get element's current value
  function getCurrentValue(element: HTMLElement): string {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement
    ) {
      return element.value;
    }
    return "";
  }

  // Helper function to format a line in the tree
  function formatLine(
    depth: number,
    elementType: string,
    xpath: string,
    value: string = "",
  ): string {
    const indent = "|   ".repeat(depth);
    const prefix = depth === 0 ? "" : "|-- ";
    return `${indent}${prefix}${elementType}(${xpath}${value ? `, "${value}"` : ""})\n`;
  }

  // Process all forms in the document
  const forms = dom.getElementsByTagName("form");
  for (const form of Array.from(forms)) {
    const formXPath = generateXPath(form);
    result += formatLine(0, "form", formXPath);

    // Process all input elements
    const inputs = form.getElementsByTagName("input");
    for (const input of Array.from(inputs)) {
      const inputXPath = generateXPath(input);
      result += formatLine(1, "input", inputXPath, getCurrentValue(input));
    }

    // Process all select elements
    const selects = form.getElementsByTagName("select");
    for (const select of Array.from(selects)) {
      const selectXPath = generateXPath(select);
      result += formatLine(1, "select", selectXPath, getCurrentValue(select));

      // Process all options
      const options = select.getElementsByTagName("option");
      for (const option of Array.from(options)) {
        const optionXPath = generateXPath(option);
        result += formatLine(
          2,
          "option",
          optionXPath,
          option.textContent || "",
        );
      }
    }

    // Process all textarea elements
    const textareas = form.getElementsByTagName("textarea");
    for (const textarea of Array.from(textareas)) {
      const textareaXPath = generateXPath(textarea);
      result += formatLine(
        1,
        "textarea",
        textareaXPath,
        getCurrentValue(textarea),
      );
    }
  }

  return result;
}

/**
 * This function to help find the elements related to the form and add xpath attribute to them
 * @param formNode - The form node to add xpath to
 * @returns The form node with xpath added
 */
export function addXpathToFormNode(formNode: Element): Element {
  const formElements = formNode.querySelectorAll(
    "input, select, textarea, option, form, fieldset, span",
  );

  for (const element of Array.from(formElements)) {
    element.setAttribute("xpath", generateXPath(element));
  }

  return formNode;
}

/**
 * Get all form elements from the dom
 * @param dom - The DOM to get the form elements from
 * @returns An array of form elements
 */
export function getFormNode(dom: Document): Element {
  // Only get the first form at the moment
  // TODO: Find a way to detect a main form. Or just found for all forms
  const formNode: Element = dom.getElementsByTagName("form")[0];
  // Add xpath to the form nodes
  addXpathToFormNode(formNode);
  return formNode;
}

/**
 * Trim out unnecessary attributes from form nodes to reduce the size of the form tree
 * Only keep the tag name, id, value, class, and aria-label attributes
 * @param formNodes - The form nodes to clean
 * @returns The cleaned form nodes
 */
export function cleanFormNode(formNode: Element): Element {
  for (const element of formNode.children) {
    // Keep only essential attributes for form
    const attributes = element.attributes;
    for (let i = attributes.length - 1; i >= 0; i--) {
      const attr = attributes[i];
      if (!["id", "class", "aria-label", "xpath"].includes(attr.name)) {
        element.removeAttribute(attr.name);
      }
    }

    // Clean input elements
    const inputs = element.getElementsByTagName("input");
    for (const input of Array.from(inputs)) {
      const attributes = input.attributes;
      for (let i = attributes.length - 1; i >= 0; i--) {
        const attr = attributes[i];
        if (
          !["id", "class", "value", "aria-label", "type", "xpath"].includes(
            attr.name,
          )
        ) {
          input.removeAttribute(attr.name);
        }
      }
    }

    // Clean select elements
    const selects = element.getElementsByTagName("select");
    for (const select of Array.from(selects)) {
      const attributes = select.attributes;
      for (let i = attributes.length - 1; i >= 0; i--) {
        const attr = attributes[i];
        if (
          !["id", "class", "value", "aria-label", "xpath"].includes(attr.name)
        ) {
          select.removeAttribute(attr.name);
        }
      }

      // Clean options
      const options = select.getElementsByTagName("option");
      for (const option of Array.from(options)) {
        const attributes = option.attributes;
        for (let i = attributes.length - 1; i >= 0; i--) {
          const attr = attributes[i];
          if (!["value", "xpath"].includes(attr.name)) {
            option.removeAttribute(attr.name);
          }
        }
      }
    }

    // Clean textarea elements
    const textareas = element.getElementsByTagName("textarea");
    for (const textarea of Array.from(textareas)) {
      const attributes = textarea.attributes;
      for (let i = attributes.length - 1; i >= 0; i--) {
        const attr = attributes[i];
        if (
          !["id", "class", "value", "aria-label", "xpath"].includes(attr.name)
        ) {
          textarea.removeAttribute(attr.name);
        }
      }
    }
  }

  return formNode;
}

/**
 * Set value for a form element identified by xpath
 * @param xpath - The xpath of the form element
 * @param value - The value to set
 * @returns true if value was set successfully, false otherwise
 */
export function inputFormValue(xpath: string, value: string): boolean {
  try {
    const element = getElementByXpath(xpath);

    if (!element) {
      console.error(`No element found for xpath: ${xpath}`);
      return false;
    }

    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      element.value = value;
      // Trigger input event to simulate user input
      element.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    }

    if (element instanceof HTMLSelectElement) {
      // Try to find option with matching value or text content
      const options = Array.from(element.options);
      const option = options.find(
        (opt) => opt.value === value || opt.textContent?.trim() === value,
      );

      if (option) {
        element.value = option.value;
        // Trigger change event to simulate user selection
        element.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      } else {
        console.error(`No matching option found for value: ${value}`);
        return false;
      }
    }

    console.error(`Unsupported element type: ${element.tagName}`);
    return false;
  } catch (error) {
    console.error(`Error setting form value: ${error}`);
    return false;
  }
}

/**
 * Submit a form identified by xpath
 * @param xpath - The xpath of the form
 * @returns true if form was submitted successfully, false otherwise
 */
export function submitForm(xpath: string): boolean {
  console.log("submitForm", xpath);
  try {
    const element = getElementByXpath(xpath);

    if (!element) {
      console.error(`No form found for xpath: ${xpath}`);
      return false;
    }

    if (!(element instanceof HTMLFormElement)) {
      console.error(`Element is not a form: ${xpath}`);
      return false;
    }

    // First try to find and click a submit button within the form
    const submitButton = element.querySelector(
      'button[type="submit"], input[type="submit"]',
    );
    if (submitButton instanceof HTMLElement) {
      submitButton.click();
      return true;
    }

    // If no submit button found, try the form's submit() method
    if (typeof element.submit === "function") {
      element.submit();
      // Also dispatch the submit event for frameworks that might be listening
      element.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
      return true;
    }

    console.error(`Could not find a way to submit the form: ${xpath}`);
    return false;
  } catch (error) {
    console.error(`Error submitting form: ${error}`);
    return false;
  }
}

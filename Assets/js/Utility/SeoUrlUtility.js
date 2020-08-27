Centauri.Utility.SeoUrlUtility = (str) => {
    /**
     * Credits @ https://stackoverflow.com/a/48000411
     */
    return str.toString()                                                        // Convert to string
        .normalize("NFD")                                                        // Change diacritics
        .replace(/[\u0300-\u036f]/g, "")                                         // Remove illegal characters
        .replace(/\s+/g, "-")                                                    // Change whitespace to dashes
        .toLowerCase()                                                           // Change to lowercase
        .replace(/&/g, Centauri.Utility.SeoUrlUtility.Replacements.and)          // Replace ampersand
        .replace(/[^a-z0-9\-]/g, "")                                             // Remove anything that is not a letter,
                                                                                 // -> number or dash
        .replace(/-+/g, "-")                                                     // Remove duplicate dashes
        .replace(/^-*/, "")                                                      // Remove starting dashes
        .replace(/-*$/, "");                                                     // Remove trailing dashes
};

Centauri.Utility.SeoUrlUtility.Replacements = {
    and: "-"
};

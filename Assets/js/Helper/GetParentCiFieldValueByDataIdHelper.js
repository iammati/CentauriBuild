Centauri.Helper.GetParentCiFieldByBtn = ($btn, dataId, parent = ".bottom") => {
    return $btn.parents(parent).find("[data-id='" + dataId + "']");
};

Centauri.Helper.GetParentCiFieldValueByDataIdHelper = ($btn, dataId, parent = ".bottom") => {
    let $element = Centauri.Helper.GetParentCiFieldByBtn($btn, dataId, parent);
    let value = $element.val();

    if($element.is("textarea")) {
        value = $element.html();
    }

    return value;
};

Centauri.Helper.GetCiFieldByBtn = $btn => {
    return $btn.next("input");
};

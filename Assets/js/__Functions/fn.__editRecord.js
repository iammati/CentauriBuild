Centauri.fn.__editRecord = (event, that, dataAttributeOrValue, ajax, action) => {
    event.preventDefault();

    let value = null;

    if(Centauri.isNotUndefined($(that).data(dataAttributeOrValue))) {
        value = $(that).data(dataAttributeOrValue);
    } else {
        value = dataAttributeOrValue;
    }

    Centauri.fn.Ajax(
        ajax,
        action,

        {
            value: value
        },

        {
            success: (data) => {
                data = JSON.parse(data);

                Centauri.Callbacks.EditRecordCallback(data);
            }
        }
    );
};

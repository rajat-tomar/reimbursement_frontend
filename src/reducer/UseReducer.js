export const initialState = localStorage.getItem("user") ? true : false;

export const reducer = (state, action) => {
    if (action.type === "USER") {
        return action.payload;
    }

    return state;
}
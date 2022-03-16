import Cookies from "js-cookie";
import { createContext, useReducer } from "react";

const initialState ={
    darkMode: (Cookies.get('darkMode') === 'ON') || false,
    cart: {
        cartItems: Cookies.get("cartItems")? JSON.parse(Cookies.get("cartItems")) : [] ,// [{id, name, quantity, price, Image}]
        shippingAddress: Cookies.get('shippingAddress')? JSON.parse(Cookies.get('shippingAddress')) : {},// {country, city, address, postalcode, fullName }
        paymentMethod: Cookies.get('paymentMethod') ?? "",// "paypal"
    },
    userInfo: Cookies.get("userInfo")? JSON.parse(Cookies.get("userInfo")) : null, // { token, id, name, email, isAdmin  }
}


const reducer = (state,action) =>{
    switch (action.type) {
        case "DARK_MODE_ON":
            Cookies.set('darkMode','ON');
            return {...state, darkMode: true};
        case "DARK_MODE_OFF":
            Cookies.set('darkMode','OFF');
            return {...state, darkMode: false};
        case "ADD_TO_CART":{
            const newItem = action.item;
            const existItem = state.cart.cartItems.find(
                (item) => item._id === newItem._id
                );
            const cartItems = existItem
                ? state.cart.cartItems.map((item) =>
                item.name === existItem.name ? newItem : item
                )
                    : [...state.cart.cartItems, newItem];
            Cookies.set('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        }
        case "REMOVE_ITEM_FROM_CART":
            Cookies.set("cartItems",JSON.stringify(state.cart.cartItems.filter(item => item.id !== action.id )));
            return {...state, cart: {...state.cart,cartItems: state.cart.cartItems.filter(item => item.id !== action.id ) } };
        case "UPDATE_ITEM_QUANTITY":
            Cookies.set("cartItems",JSON.stringify(state.cart.cartItems.filter((item,index)=> index !== action.index).concat([{...state.cart.cartItems[action.index],quantity: action.quantity}])))
            return {...state, cart: {...state.cart,cartItems: state.cart.cartItems.filter((item,index)=> index !== action.index).concat([{...state.cart.cartItems[action.index],quantity: action.quantity}]) } };
        case "USER_LOGIN":
            Cookies.set("userInfo",JSON.stringify(action.data));
             return {...state, userInfo: action.data };
        case 'USER_LOGOUT':
            Cookies.remove('userInfo');
            Cookies.remove('cartItems');
            Cookies.remove('shippinhAddress');
            Cookies.remove('paymentMethod');
            return {...state, cart: {cartItems: [], shippingAddress: {}, paymentMethod: ""}, userInfo: null}
        case 'SAVE_SHIPPING_ADDRESS':
            Cookies.set('shippingAddress', JSON.stringify(action.shippingAddress),{ expires: 30 });
            return {...state, cart: {...state.cart,shippingAddress: action.shippingAddress} }
        case "SAVE_PAYMENT_METHOD":
            Cookies.set('paymentMethod', action.method);
            return {...state, cart: {...state.cart,paymentMethod: action.method} };
        case "CLEAR_CART":
            Cookies.remove('cartItems');
            return {...state, cart: {...state.cart,cartItems: []} };

            default:
            return state;
    }
}

export const Store = createContext();


export default function StoreProvider({children}){
    const [state, dispatch] = useReducer(reducer,initialState);

    return <Store.Provider value={{state, dispatch}}>
             {children}
            </Store.Provider>
}
import React from 'react'
import{PayPalButtons,PayPalScriptProvider} from "@paypal/react-paypal-js"

const PayPalButton = ({amount,onSuccess,onError}) => {
  return (
    <PayPalScriptProvider options={{"client-id":"AfBVUyXqrnLDyjiIDYfrvEed3DFEs3Dnh0Vg_yTUewZjJR0Njb0Lify5w-pR9L1y4p_eYScq0IT6bjbD"}}>
          <PayPalButtons style={{layout:"vertical"}}
          createOrder={(data,actions)=>{
            return actions.order.create({
                purchase_units:[{amount:{value:amount}}]
            })
          }}
          onApprove={(data,actions)=>{
            return actions.order.capture().then(onSuccess)
          }
          }
          onError={onError}/>

    </PayPalScriptProvider>)
}

export default PayPalButton
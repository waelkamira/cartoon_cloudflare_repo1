import braintree from 'braintree';

type Environment = 'Sandbox' | 'Production';

export const gateway = new braintree.BraintreeGateway({
  environment:
    braintree.Environment[process.env.BRAINTREE_ENVIRONMENT as Environment],
  merchantId: process.env.BRAINTREE_MERCHANT_ID as string,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY as string,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY as string,
});

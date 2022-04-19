import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {TipHistory as TipHistoryComponent} from '.';
import {CurrencyId} from '../../interfaces/currency';
import {ContentType, WalletType} from '../../interfaces/wallet';

import {NetworkTypeEnum, WalletTypeEnum} from 'src/lib/api/ext-auth';

export default {
  title: 'UI Revamp v2.0/components/Tip History',
  component: TipHistoryComponent,
  argTypes: {},
} as ComponentMeta<typeof TipHistoryComponent>;

const Template: ComponentStory<typeof TipHistoryComponent> = args => (
  <TipHistoryComponent {...args} />
);

export const TipHistory = Template.bind({});
TipHistory.args = {
  open: true,
  tips: [
    {
      id: '6113fa9c4823991bf8fa92ee',
      hash: '0x1527f32aa39d5161808f694b50790366e74e74193459b90564fc1c442640c5b5',
      amount: 1,
      from: '0x48c145fb4a5aeb32075023a576180107ecc1e5470ab2ebdd1965b71a33dad363',
      to: '0x48c8e77939a6be6e40d3bd2c0e2346f4958f3de887384d76ed19e13a718ec672',
      currencyId: 'MYRIA',
      referenceId: '6113fa9c4823991bf8fa92ee',
      createdAt: new Date('2021-08-11T16:28:12.000Z'),
      updatedAt: new Date('2021-09-02T03:11:28.000Z'),
      type: ContentType.POST,
      fromWallet: {
        id: '0x76709daddc7f97dede94a4ab9bc168fd4f5b5a96bf15adfdb247d6f0d2276d39',
        type: WalletTypeEnum.POLKADOT,
        networkId: NetworkTypeEnum.POLKADOT,
        primary: true,
        userId: '6232d3a5dbe01066471dca12',
        createdAt: new Date('2021-08-11T16:28:12.000Z'),
        updatedAt: new Date('2021-09-02T03:11:28.000Z'),
        user: {
          id: '6232d3a5dbe01066471dca12',
          name: 'NutrisariJerukManisBgt',
          username: 'nutrisarijeruk',
          bannerImageUrl: 'https://res.cloudinary.com/dsget80gs/background/profile-default-bg.png',
          metric: {
            totalPosts: 16,
            totalExperiences: 0,
            totalFriends: 1,
            totalKudos: 6,
            totalActivity: 0,
          },
          fcmTokens: [
            'fM81j8jUKRehhMEMnmywDp:APA91bGNtuY21why3uy9SqANRega5BiPSTI8deQuFN8Bg4l2g8_VZH2gbj-TCyI50n31zUiiK-wOLnQettT4Pbm2qRRj-GY3Hs24YqgjoDMGeCvnK-94_NVJTNsWSNQUrkzDGfPYLRBX',
          ],
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          wallets: [],
          currencies: [],
        },
      },
      toWallet: {
        id: '0xd6a98971eb249a031daebf0856c693ef73018cc4a77a703061f44794abc1931a',
        type: WalletTypeEnum.POLKADOT,
        networkId: NetworkTypeEnum.POLKADOT,
        primary: true,
        userId: '6232d3a5dbe01066471dca12',
        createdAt: new Date('2021-08-11T16:28:12.000Z'),
        updatedAt: new Date('2021-09-02T03:11:28.000Z'),
        user: {
          id: '6232eaa8dbe01066471dd305',
          name: 'Mojito',
          username: 'mojito',
          bannerImageUrl: 'https://res.cloudinary.com/dsget80gs/background/profile-default-bg.png',
          bio: 'nospacnoeefbahfjabhfbahbhasbhbahjbhcjaschjbashbahbsabchabshcbshbhcsbhcbshbchsbchsbchbsjcbahbchabhcbashchahcahcbhasasbchbashbchabshbchsbhcbshchshcscabjbshbhacbsh',
          websiteURL:
            'asjabhjfbahsbhasbhjfabhbashbhabshbashbhsabhbshbchsbjcnsjcksakocaoidiqwuhqwbdhjwbfhsbnvbsndbvhsdbvdhvbhdbvhsdjknskldvksdnjvnsdjkvsdhvhsbdvhbdshvsdhvjsnjdbjhdjnvjdbhvbdshvbdhsbvhdsbhvbhdsbvhdbvhbdshvbsdivsyighfuehfiusfjhskdfnjkshdfheiufhdjsfkjsdbhfbshdfhsdgfihsgfsdhfhsdbfhsdbfhsgdfhshdfjsjfioahuifgewygygwygyfggyegfyegyfgeyfbsjnjkhdjhdgsygdygysdbhbdsnjshjdfhueguifhiowhejfnjwenfaiohfuagyehbbhsbfhsbdhfgsdufhsudfhsodhfoishoeishjefbshbdfgsufhjskndjfnsjkdbfusgeufhuisheufhsnefjksndjkfhsuhdfuihsuehfseugfushufhushuehfhsbfbhsbehfbshebjhfsbhejbfhsbehfbshefusheuhfusheuofhsoef',
          metric: {
            totalPosts: 59,
            totalExperiences: 5,
            totalFriends: 21,
            totalKudos: 1,
            totalActivity: 0,
          },
          fcmTokens: [
            'fo543qfdG3fefsmIXPMT3w:APA91bGVWpZCzlp2xZ5rIDP_lixznZvz1fZUTu3CrO4S01Rdid3ApX7i1jUUHU6V4muDxDf1qMG_cV314oR1ARr2KjdyeifExXBeMLiLI9jLBNcrxCmvmAdQqMq0JAAO9PNpKXQcCSIP',
          ],
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          wallets: [],
          currencies: [],
          onTimeline: '6217442ba12172001c2a36da',
        },
      },
      currency: {
        id: 'rawahkjwhakwhawa',
        name: 'dot',
        image: 'https://res.cloudinary.com/dsget80gs/coins/aca.svg',
        decimal: 13,
        native: true,
        symbol: CurrencyId.DOT,
        createdAt: new Date(),
        updatedAt: new Date(),
        networkId: 'polkadot',
        network: {
          id: 'polkadot',
          image:
            'https://polkadot.network/assets/img/brand/Polkadot_Token_PolkadotToken_Pink.svg?v=3997aaa2a4',
          rpcURL: 'wss://rpc.polkadot.io',
          explorerURL:
            'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.polkadot.io#/explorer/query',
          walletType: WalletType.POLKADOT,
          createdAt: new Date(),
          updatedAt: new Date(),
          currencies: [],
        },
      },
    },
    {
      id: '60f0df4ded9d581bd986d8d6',
      hash: '0x2b4d31d7f684d3ce9eef9c30d438efe62a39113c45d57c22f400b1a9c44b751b',
      amount: 0.1,
      type: ContentType.POST,
      referenceId: '60f0df4ded9d581bd986d8d6',
      createdAt: new Date('2021-08-11T16:28:12.000Z'),
      updatedAt: new Date('2021-09-02T03:11:28.000Z'),
      from: '0x1c2ab7c8bda0b1f3980fa5e88c394e663aab7b8e0c39ba1b8b35c112a0bfb62d',
      to: '0x2ec9196df3273291729097c5c9411ba6add6c84c94e4de0327ff351c1fbb8556',
      currencyId: 'AUSD',
      fromWallet: {
        id: '0x76709daddc7f97dede94a4ab9bc168fd4f5b5a96bf15adfdb247d6f0d2276d39',
        type: WalletTypeEnum.POLKADOT,
        networkId: NetworkTypeEnum.POLKADOT,
        primary: true,
        userId: '6232d3a5dbe01066471dca12',
        createdAt: new Date('2021-08-11T16:28:12.000Z'),
        updatedAt: new Date('2021-09-02T03:11:28.000Z'),
        user: {
          id: '6232d3a5dbe01066471dca12',
          name: 'NutrisariJerukManisBgt',
          username: 'nutrisarijeruk',
          bannerImageUrl: 'https://res.cloudinary.com/dsget80gs/background/profile-default-bg.png',
          metric: {
            totalPosts: 16,
            totalExperiences: 0,
            totalFriends: 1,
            totalKudos: 6,
            totalActivity: 0,
          },
          fcmTokens: [
            'fM81j8jUKRehhMEMnmywDp:APA91bGNtuY21why3uy9SqANRega5BiPSTI8deQuFN8Bg4l2g8_VZH2gbj-TCyI50n31zUiiK-wOLnQettT4Pbm2qRRj-GY3Hs24YqgjoDMGeCvnK-94_NVJTNsWSNQUrkzDGfPYLRBX',
          ],
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          wallets: [],
          currencies: [],
        },
      },
      toWallet: {
        id: '0xd6a98971eb249a031daebf0856c693ef73018cc4a77a703061f44794abc1931a',
        type: WalletTypeEnum.POLKADOT,
        networkId: NetworkTypeEnum.POLKADOT,
        primary: true,
        userId: '6232d3a5dbe01066471dca12',
        createdAt: new Date('2021-08-11T16:28:12.000Z'),
        updatedAt: new Date('2021-09-02T03:11:28.000Z'),
        user: {
          id: '6232eaa8dbe01066471dd305',
          name: 'Mojito',
          username: 'mojito',
          bannerImageUrl: 'https://res.cloudinary.com/dsget80gs/background/profile-default-bg.png',
          bio: 'nospacnoeefbahfjabhfbahbhasbhbahjbhcjaschjbashbahbsabchabshcbshbhcsbhcbshbchsbchsbchbsjcbahbchabhcbashchahcahcbhasasbchbashbchabshbchsbhcbshchshcscabjbshbhacbsh',
          websiteURL:
            'asjabhjfbahsbhasbhjfabhbashbhabshbashbhsabhbshbchsbjcnsjcksakocaoidiqwuhqwbdhjwbfhsbnvbsndbvhsdbvdhvbhdbvhsdjknskldvksdnjvnsdjkvsdhvhsbdvhbdshvsdhvjsnjdbjhdjnvjdbhvbdshvbdhsbvhdsbhvbhdsbvhdbvhbdshvbsdivsyighfuehfiusfjhskdfnjkshdfheiufhdjsfkjsdbhfbshdfhsdgfihsgfsdhfhsdbfhsdbfhsgdfhshdfjsjfioahuifgewygygwygyfggyegfyegyfgeyfbsjnjkhdjhdgsygdygysdbhbdsnjshjdfhueguifhiowhejfnjwenfaiohfuagyehbbhsbfhsbdhfgsdufhsudfhsodhfoishoeishjefbshbdfgsufhjskndjfnsjkdbfusgeufhuisheufhsnefjksndjkfhsuhdfuihsuehfseugfushufhushuehfhsbfbhsbehfbshebjhfsbhejbfhsbehfbshefusheuhfusheuofhsoef',
          metric: {
            totalPosts: 59,
            totalExperiences: 5,
            totalFriends: 21,
            totalKudos: 1,
            totalActivity: 0,
          },
          fcmTokens: [
            'fo543qfdG3fefsmIXPMT3w:APA91bGVWpZCzlp2xZ5rIDP_lixznZvz1fZUTu3CrO4S01Rdid3ApX7i1jUUHU6V4muDxDf1qMG_cV314oR1ARr2KjdyeifExXBeMLiLI9jLBNcrxCmvmAdQqMq0JAAO9PNpKXQcCSIP',
          ],
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          wallets: [],
          currencies: [],
          onTimeline: '6217442ba12172001c2a36da',
        },
      },
      currency: {
        id: 'rawahkjwhakwhawa',
        name: 'dot',
        image: 'https://res.cloudinary.com/dsget80gs/coins/aca.svg',
        decimal: 13,
        native: true,
        symbol: CurrencyId.DOT,
        createdAt: new Date(),
        updatedAt: new Date(),
        networkId: 'polkadot',
        network: {
          id: 'polkadot',
          image:
            'https://polkadot.network/assets/img/brand/Polkadot_Token_PolkadotToken_Pink.svg?v=3997aaa2a4',
          rpcURL: 'wss://rpc.polkadot.io',
          explorerURL:
            'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.polkadot.io#/explorer/query',
          walletType: WalletType.POLKADOT,
          createdAt: new Date(),
          updatedAt: new Date(),
          currencies: [],
        },
      },
    },
  ],
  currencies: [
    {
      id: 'rawahkjwhakwhawa',
      name: 'dot',
      image: 'https://res.cloudinary.com/dsget80gs/coins/aca.svg',
      decimal: 13,
      native: true,
      symbol: CurrencyId.DOT,
      createdAt: new Date(),
      updatedAt: new Date(),
      networkId: 'polkadot',
      network: {
        id: 'polkadot',
        image:
          'https://polkadot.network/assets/img/brand/Polkadot_Token_PolkadotToken_Pink.svg?v=3997aaa2a4',
        rpcURL: 'wss://rpc.polkadot.io',
        explorerURL:
          'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.polkadot.io#/explorer/query',
        walletType: WalletType.POLKADOT,
        createdAt: new Date(),
        updatedAt: new Date(),
        currencies: [],
      },
    },
  ],
  onClose: console.log,
};

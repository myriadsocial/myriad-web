import React from 'react';

import getConfig from 'next/config';
import Head from 'next/head';
import Link from 'next/link';

import {Paper} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import MyriadIcon from 'src/images/web/myriad.svg';
import i18n from 'src/locale';

const {publicRuntimeConfig} = getConfig();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '20px 40px 60px 40px',
    },
    content: {
      width: '800px',
      margin: 'auto',
      fontSize: '16px',
    },
    center: {textAlign: 'center'},
    title: {fontSize: '56px'},
    subtitle: {fontWeight: 400},
    paragraph: {fontWeight: 600},
    link: {color: 'inherit'},
  }),
);

const TermOfUse: React.FC = () => {
  const style = useStyles();

  return (
    <Paper className={style.root}>
      <Head>
        <title>{i18n.t('TermOfUse.Title', {appname: publicRuntimeConfig.appName})}</title>
      </Head>
      <MyriadIcon />
      <div className={style.content}>
        <h1 className={`${style.center} ${style.title}`}>TERMS OF USE</h1>
        <p className={`${style.paragraph}`}>
          THESE TERMS OF USE MUST BE READ BEFORE USING MYRIAD SERVICE. THE USAGE OF ANY PART OF THE
          MYRIAD SERVICE INDICATES ACCEPTANCE OF THESE TERMS OF USE.
        </p>
        <p className={`${style.paragraph}`}>
          The www.myriad.social site, mobile application, as well as any application listed on this
          website as produced by Myriad (“<b>Platform</b>”) is managed by Myriad.Social including
          its subsidiaries and affiliated companies (hereinafter referred to as “<b>we</b>”, “
          <b>us</b>”, “<b>our</b>”, “<b>Myriad</b>”, or “<b>Platform</b>”). By accessing and/or
          using any part of the Platform and our related websites, services, applications, products
          and content (collectively, the “<b>Service</b>”) you acknowledge that you have read and
          understood, and agree to the Terms of Use (“<b>Terms</b>”) and other terms and conditions
          in relation to the Platform as referred to in these Terms. If you do not agree to be bound
          by these Terms, you may not access or use any part of the Platform.
        </p>
        <p className={`${style.paragraph}`}>
          These Terms constitute a binding legal agreement between you as an individual user of the
          Platform (“<b>you</b>”, “<b>your</b>”, “<b>user</b>”) and Myriad. Users of the Platform
          shall include community operator, content hosters, server operator, advertisers,
          experience creators, and ad-space operator, any other ad-relevant content creators, and
          Myriad users. You must comply with the age of majority as specified under the applicable
          laws to these Terms to use the Platform. If you are accepting these Terms and using the
          Services on behalf of a company, organization, government, or other legal entity, you
          represent and warrant that you are authorized to do so and have the authority to bind such
          entity to these Terms, in which case the words “you” and “your” as used in these Terms
          shall refer to such entity.
        </p>
        <p className={`${style.paragraph}`}>
          Please note that we may change, modify, add and delete these Terms at any time for any
          reason, including but not limited to the necessity to comply with any law or regulation
          binding on us or to reflect a change to our operational practices, provided that in any
          case, we will use reasonable effort to provide notice of material changes on the Platform.
          Every time you use the Platform or our service, please check Terms of Use to ensure that
          you have reviewed the current version. By continuing to use any part of the Platform after
          such changes to these Terms, you agree and consent to the changes.
        </p>
        <ol>
          <h2>
            <li>YOUR ACCOUNT WITH US</li>
          </h2>
          <p className={`${style.paragraph}`}>
            To access or use some of our Services, you must create an account with us. When you
            create this account, you must provide your user account information. It is important
            that you cannot change your user account which is different from the first time you
            register your account on our Service.
          </p>
          <p className={`${style.paragraph}`}>
            These terms are also accessible to you on the Platform and when you are using our
            Services at all times. We will process your registration, and your account will be
            automatically active after the registration. It is important that you keep your account
            password (or a private key) confidential and that you do not disclose it to any third
            party. If you know or suspect that any third party knows your password or has accessed
            your account, you must notify us immediately. We may require you to authenticate certain
            actions taken when you are using the Platform and/or Services by using a digital
            signature or similar electronic authentication process.
          </p>
          <h2>
            <li>USING OUR SERVICES</li>
          </h2>
          <p className={`${style.paragraph}`}>
            Your access to and use of the Service is subject to these Terms and all applicable laws
            and regulations. You may not:
          </p>
          <ol>
            <li>
              Interfere with or attempt to interfere with the proper working of the Services,
              disrupt our website or any networks connected to the Services, or bypass any measures
              we may use to prevent or restrict access to the Services;
            </li>
            <li>
              Incorporate the Services or any portion thereof into any other program or product
              without prior approval from us or in accordance with these Terms. In such case, we
              reserve the right to refuse service, terminate accounts or limit access to the
              Services in our sole discretion;
            </li>
            <li>
              Intimidate or harass another, or promote sexually explicit material, violence or
              discrimination based on race, sex, religion, nationality, disability, sexual
              orientation or age;
            </li>
            <li>
              Use the Services, without our express written consent, for any commercial or
              unauthorized purpose, including communicating or facilitating any commercial
              advertisement or solicitation or spamming;
            </li>
            <li>
              Use the Services to upload, transmit, distribute, store or otherwise make available in
              any way: files that contain viruses, trojans, worms, logic bombs or other material
              that is malicious or technologically harmful;
            </li>
            <li>
              Use or attempt to use another’s account, service or system without authorization from
              Myriad;
            </li>
            <li>
              Use the Services in a manner that may create a conflict of interest or undermine the
              purposes of the Services, such as trading reviews with other users or writing or
              soliciting fake reviews;
            </li>
            <li>
              Access or use the Services if you are not fully able and legally competent to agree to
              these Terms or are authorized to use the Services by your parent or legal guardian;
            </li>
            <li>
              Make unauthorized copies, modify, adapt, translate, reverse engineer, disassemble,
              decompile or create any derivative works of the Services or any content included
              therein, including any files, tables or documentation (or any portion thereof) or
              determine or attempt to determine any source code, algorithms, methods, techniques,
              Dapp, or smart contract embodied by the Services or any derivative works thereof,
              except that those modification or variation activities subject to and in accordance
              with the terms of this agreement and strictly adopt licensing requirement under GNU
              AFFERO GENERAL PUBLIC LICENSE [https://www.gnu.org/licenses/agpl-3.0-standalone.html];
            </li>
            <li>
              Create or post any material that would constitute, encourage or provide instructions
              for a criminal offence, dangerous activities or self-harm (terrorism, trafficking,
              etc.);
            </li>
            <li>
              Create or post any material which does or may infringe any copyright, trademark or
              other intellectual property or privacy rights of any other person;
            </li>
            <li>
              Create or post any material with the sole objective of damaging, materially or
              otherwise, the private life of a person; ;
            </li>
            <li>Create or post any material encouraging the partaking into an illegal activity;</li>
            <li>
              Create or post any material that contains a threat of any kind, including threats of
              physical violence;
            </li>
            <li>
              Create or post any material that is racist or discriminatory, including discrimination
              on the basis of someone’s race, religion, age, gender, disability or sexuality;
            </li>
            <li>
              Create or post any material which is defamatory of any person, obscene, offensive,
              pornographic, hateful or inflammatory;
            </li>
            <li>
              Impersonate any person or entity, or falsely state or otherwise misrepresent you or
              your affiliation with any person or entity, including giving the impression that any
              content you upload, post, transmit, distribute or otherwise make available emanates
              from the Services;
            </li>
            <li>
              Use automated scripts to collect information from or otherwise interact with the
              Services;
            </li>
            <li>
              Distribute, license, transfer, or sell, in whole or in part, any of the Services or
              any derivative works thereof
            </li>
            <li>
              Any unsolicited or unauthorized advertising, solicitations, promotional materials,
              “junk mail,” “spam,” “chain letters,” “pyramid schemes,” or any other prohibited form
              of solicitation;
            </li>
            <li>
              Collecting, processing, and/or sharing any private information of any third party,
              including addresses, phone numbers, email addresses, number and feature in the
              personal identity document (e.g., National Insurance numbers, passport numbers) or
              credit card numbers;
            </li>
            <li>
              Material that, in the sole judgment of Myriad or Myriad community, is objectionable or
              which restricts or inhibits any other person from using the Services, or which may
              expose Myriad, the Services or its users to any harm or liability of any type.
            </li>
          </ol>
          <p className={`${style.paragraph}`}>
            We reserve the right, at any time and without prior notice, to remove or disable access
            to content at our discretion for any reason or no reason. Some of the reasons we may
            remove or disable access to content may include finding the content objectionable, in
            violation of these Terms or Myriad community, or otherwise harmful to the Services or
            our users. Our automated systems analyze your content (including any personal
            information if applicable) to provide you personally relevant product features, such as
            customized search results, tailored advertising, and spam and malware detection. This
            analysis occurs as the content is sent, received, and when it is stored.
          </p>
          <p className={`${style.paragraph}`}>
            We may update and change our Platform or Services from time to time to reflect changes
            to our product, our user’s needs, our business priorities, and/or our beta testing
            features. We reserve the right to make unilateral changes to our Platform or website
            without giving you reasonable notice. However, we will try to give you reasonable notice
            of any major changes based on our own consideration.
          </p>
          <h2>
            <li>OUR POLICY ON SUSPENSION OR WITHDRAWAL OF PLATFORM</li>
          </h2>
          <p className={`${style.paragraph}`}>Our Platform is made available free of charge.</p>
          <p className={`${style.paragraph}`}>
            We do not guarantee that our Platform, or any content on it, will always be available or
            be uninterrupted. We may suspend or withdraw or restrict the availability of any or any
            part of our Platform for business and operational reasons. We will try to give you
            reasonable notice of any suspension or withdrawal.
          </p>
          <p className={`${style.paragraph}`}>
            You are also responsible for ensuring that all persons who access our Platform through
            your internet connection are aware of these terms and conditions and other applicable
            terms and conditions, and that they comply with them.
          </p>
          <h2>
            <li>CONTENT ON THE PLATFORM</li>
          </h2>
          <p className={`${style.paragraph}`}>
            YOUR UPLOADED OR HOSTED TEXT, IMAGES, VIDEOS, SOUNDS, AND OR ANY OTHER MATERIALS
            (HEREINAFTER REFERRED TO AS THE “<b>CONTENT</b>”) ON OUR PLATFORM IS YOUR OWNERSHIP AND
            RESPONSIBILITY TO THE EXTENT PERMITTED BY THE APPLICABLE LAWS. WE DO NOT CLAIM OWNERSHIP
            NOR RESPONSIBILITY OF YOUR CONTENT FOR ANY WHATEVER REASONS.
          </p>
          <p className={`${style.paragraph}`}>
            To the extent necessary to provide the Services to you and others, to protect you and
            the Services, and to improve Myriad products and services, you grant to Myriad a
            worldwide and royalty-free intellectual property license to use Your Content, for
            example, to make copies of, retain, transmit, reformat, display, and distribute via
            communication tools Your Content on the Services.
          </p>
          <p className={`${style.paragraph}`}>
            You should only provide Content that you are comfortable sharing with others. Any use or
            reliance on any Content or materials posted through the Platform or obtained by you
            through the Platform is at your own risk.
          </p>
          <p className={`${style.paragraph}`}>
            We do not endorse, support, represent or guarantee the completeness, truthfulness,
            accuracy, or reliability of any Content or communications posted via the Platform or
            endorse any opinions expressed via the Platform.
          </p>
          <p className={`${style.paragraph}`}>
            We do not verify nor approve Your Content posted via the Services and, we cannot take
            responsibility for Your Content. The views expressed by Users on our Platform do not
            represent our views or values nor intended to amount to advice on which you should rely.
          </p>
          <p className={`${style.paragraph}`}>
            You understand that by using our Platform or our Services, you may be exposed to Content
            that might be offensive, harmful, inaccurate or otherwise inappropriate, or in some
            cases, postings that have been mislabeled or are otherwise deceptive.
          </p>
          <p className={`${style.paragraph}`}>
            We reserve the right to remove Content and/or Your Myriad Account that violates these
            Terms based on our own consideration or sole discretion.
          </p>
          <p className={`${style.paragraph}`}>
            If you wish to complain about content uploaded by other users or you mistakenly believe
            that we have blocked your uploaded content in our Platform, please contact us.
          </p>
          <ol>
            <li>
              <b>Our Content</b>
            </li>
            <ul>
              <li>
                <b>We Own Content Solely Provided By Us (Excluding User Content)</b>. As between you
                and Myriad, all content, software, images, text, graphics, illustrations, logos,
                patents, trademarks, service marks, copyrights, photographs, audio, videos, music of
                the Services, the Site, and the Platform, and all intellectual property rights
                related thereto (the “<b>Myriad Content</b>”), are either owned by or licensed to
                Myriad. Use by you of the Myriad Content or other materials available as part of the
                Services for any purpose not expressly permitted by these Terms is strictly
                prohibited. We and our licensors reserve absolutely and unconditionally all rights
                arising out of or in connection with the Services and the Myriad Content not
                expressly granted in and to such content and materials.
              </li>
              <li>
                <b>Grant of Rights from Us to You</b>. Subject to these Terms, you are hereby
                granted a non-exclusive, limited, non-transferable, non-sublicensable, revocable,
                worldwide license to access and use the Services, including to download the Platform
                on a permitted device, and to access the Service solely for your personal or
                commercial use through your use of the Services and solely in compliance with these
                Terms. Myriad reserves absolutely and unconditionally all rights not expressly
                granted herein in the Services and the Myriad Content. You acknowledge and agree
                that upon any termination of your account or these Terms, this license granted to
                you in respect of the Services will automatically terminate.
              </li>
              <li>
                <b>No representation and Warranties over the Content</b>. We make no
                representations, warranties or guarantees, whether express or implied, that any
                Myriad Content is accurate, complete or up to date. Where the Services contain links
                to other sites and resources provided by third parties, these links are provided for
                your general information only. We have no visibility or control over the contents on
                or available through those sites or resources and you acknowledge and agree that we
                have no liability for any such content. Such links should not be interpreted as
                approval by us of those linked websites or information you may obtain on or through
                them. You acknowledge that we have no obligation to pre-screen, filter, monitor,
                review, or edit any content posted by you and other users on the Platform (including
                User Content).
              </li>
            </ul>
            <li>
              <b>User-Generated Content</b>
            </li>
            <ul>
              <li>
                <b>Create or Post Content</b>. Users of the Services may be permitted to upload,
                post or transmit (such as via a stream) or otherwise make available content through
                the Services including, without limitation, any text, photographs, user videos,
                sound recordings and the musical works embodied therein (including videos that
                incorporate locally stored sound recordings from your personal music library and
                ambient noise) uploaded to, or otherwise made available through, the Services (“User
                Content”). You acknowledge and agree that users of the Services may also extract all
                or any portion of User Content uploaded or otherwise made available by you through
                the Services so as to produce additional User Content, including collaborative User
                Content with other users that combine and intersperse with User Content generated by
                you and other users.
              </li>
              <li>
                <b>Selling your Content</b>. Users of the Services may also overlay music, graphics,
                stickers, Myriad Tokens, Social Currency, NFTs, digital token/asset, crypto-asset,
                and other elements provided by Myriad (“<b>Myriad Elements</b>”) onto User Content
                and transmit this User Content through the Services. The information and materials
                in the User Content, including User Content that includes Myriad Elements, have not
                been verified or approved by us. The views expressed by other users on the Services
                (including through use of the Myriad Tokens) do not represent our views or values.
                You have the right to sell your Content posted in our Platform to other Myriad’s
                User and/or other third party. You also have the right to sell the Myriad Tokens,
                Social Currency, and NFTs in the third-party provider, provided that if you wish to
                sell any User Content in a third-party provider, you will be subject to the terms
                and conditions set out in such third-party provider (e.g.&nbsp;
                <Link href={`https://opensea.io`}>
                  <a
                    href={`https://opensea.io`}
                    target="_blank"
                    rel="noreferrer"
                    className={style.link}>
                    https://opensea.io
                  </a>
                </Link>
                &nbsp;). If you wish to sell your Content, whether through our Platform or through a
                third-party provider, you understand and agree that the transaction settlement shall
                use a Myriad Token (see our Crypto Currency Policy below) or other currency as
                determined from time to time by Us or the third-party provider. You understand and
                agree when you are buying a Content in the Platform using a Myriad Token, it cannot
                be refunded or returned. [This will be subject to local laws and regulations].
              </li>
              <li>
                <b>Uploading in a Third Party Site</b>. You may also choose to upload or transmit
                your User Content, including User Content that includes Myriad Elements, on sites or
                platforms hosted by third parties. If you decide to do this, you must comply with
                their content guidelines as well as with the standards set out in this Section. You
                warrant that any such contribution does comply with those standards, and you will be
                liable to us and indemnify us for any breach of that warranty. This means you will
                be responsible for any loss or damage we suffer as a result of your breach of
                warranty.
              </li>
              <li>
                <b>No Confidentiality over the Content You Post</b>. Any User Content will be
                considered non-confidential. You must not post any User Content on or through the
                Services or transmit to us any User Content that you consider to be confidential or
                proprietary to any other person. When you submit User Content through the Services,
                you agree and represent that you own that User Content, or you have received all
                necessary permissions (including any necessary licenses), clearances from, or are
                authorized by, the owner of any part of the content to submit such User Content to
                the Services, to transmit it from the Services to other third party platforms,
                and/or to otherwise make any use of such User Content on or through the Services.
              </li>
              <li>
                <b>Posting an Intellectual Protected Content</b>. If you only own the rights in and
                to a sound recording, but not to the underlying musical works embodied in such sound
                recordings, then you must not upload or otherwise make available such sound
                recordings through the Services unless you have all permissions (including any
                necessary licenses), clearances from, or are authorized by, the owner of any part of
                the content to submit it to the Services.
              </li>
              <li>
                <b>You Own Your Content and Grant of Rights from You to Us</b>. Except as expressly
                provided otherwise in these Terms, you or the owner of your User Content still own
                the copyright and any other intellectual property rights in User Content sent to us,
                but by submitting User Content via the Services, you hereby grant (i) to us and our
                affiliates, agents, services providers, partners and other connected third parties
                an unconditional irrevocable, non-exclusive, royalty-free, fully transferable
                (including sub-licensable), perpetual worldwide licence to use, modify, adapt,
                reproduce, make derivative works of, publish and/or transmit, and/or distribute and
                to authorize others users of the Services and other third-parties to view, access,
                use, download, modify, adapt, reproduce, make derivative works of, publish and/or
                transmit your User Content in any format and on any platform, either now known or
                hereinafter invented; (ii) to other users of the Services an unconditional
                irrevocable, non-exclusive, royalty-free, perpetual worldwide licence to use,
                modify, adapt, reproduce, make derivative works of, download, publish and/or
                transmit, and/or distribute some or all of your User Content in any format and on
                any platform, either now known or hereinafter invented for the purpose of generating
                other User Content or viewing your User Content for entertainment or other private,
                non-commercial purposes. You further grant us and our affiliates, agents, services
                providers, partners and other connected third parties a royalty-free license to use
                your username, image, voice, and likeness to identify you as the source of any of
                your User Content.
              </li>
              <li>
                <b>Waiver of Rights to User Content</b>. By posting User Content to or through the
                Services, you waive any rights to prior inspection or approval of any marketing,
                promotional, or tokenization materials related to such User Content. You also waive
                any and all rights of privacy, publicity, or any other rights of a similar nature in
                connection with your User Content, or any portion thereof. To the extent any moral
                rights are not transferable or assignable, you hereby waive and agree never to
                assert any and all moral rights, or to support, maintain or permit any action based
                on any moral rights that you may have in or with respect to any User Content you
                Post to or through the Services.
              </li>
              <li>
                <b>Our Right when Handling a Copyright Complaint</b>. We also have the right to
                disclose your identity to any third party who is claiming that any User Content
                posted or uploaded by you to our Services constitutes a violation of their
                intellectual property rights, or of their right to privacy.
              </li>
            </ul>
          </ol>
          <h2>
            <li>TIPPING AND NFT FEATURES</li>
          </h2>
          <p className={`${style.paragraph}`}>
            In addition to Myriad User rights under these Terms, User grants Myriad an unconditional
            irrevocable, non-exclusive, royalty-free, fully transferable (including sub-licensable),
            perpetual worldwide licence to:
          </p>
          <ol>
            <li>
              commercially use publicly posted Content in a way that may increase goodwill or
              otherwise increase the value from our service;
            </li>
            <li>
              collect, for use private to Myriad, anonymized behavioral data including but not
              limited to time spent on the Platform, user interface usage, web logs, website
              interaction, and any other similar data; and/or{' '}
            </li>
            <li>collect temporary session data necessary to the use of the Platform.</li>
          </ol>
          <p className={`${style.paragraph}`}>
            <u>
              <b>Tipping Feature</b>
            </u>
            . Tipping is the action of rewarding User by sending them, through the interface of any
            Myriad product, an amount of cryptocurrency in accordance with our Crypto Currency
            Policy as set out in Section 7 below. You understand that by using this tipping feature
            in our Platform, this tipping feature:
          </p>
          <ol>
            <li>rests exclusively on the good will of User;</li>
            <li>is not compulsory;</li>
            <li>
              does not constitute in any whatever way the sales, rental, or otherwise
              commercialization of Content; and
            </li>
            <li>does not constitute in any way the change of ownership of posted Content.</li>
          </ol>
          <p className={`${style.paragraph}`}>
            <u>
              <b>Non-Fungible Tokens (“NFTs”) Feature</b>
            </u>
            . NFTs are sets of data that can algorithmically prove the provenance of a given piece
            of a Content, in relation to the blockchain platform on which they have been issued. You
            may transform your Content posted on our Platform into NFTs. You are entitled to
            transfer these NFTs to another User. Please note that when you are transferring the NFT,
            the following provisions shall apply:
          </p>
          <ol>
            <li>
              such transfer will not constitute a transfer or assignment of right to copyright,
              trademark, or any other intellectual property unless the transferor declares and
              agrees that they own such intellectual property rights in the NFT and agree to
              transfer the intellectual property rights contained in it;{' '}
            </li>
            <li>
              Myriad does not represent nor guarantee any transfer or assignment of the NFT or the
              intellectual property rights contained in it;{' '}
            </li>
            <li>
              You hereby agree to indemnify and hold Myriad harmless from all lawsuits that arise
              from the transfer or assignment of the NFTs, including but not limited to intellectual
              property rights lawsuits; and
            </li>
            <li>
              You hereby agree that you will be solely responsible for assignment or transfer of the
              NFTs and/or any intellectual property, including copyright and neighbouring rights,
              contained in it in accordance with the applicable laws related to intellectual
              property rights.
            </li>
          </ol>
          <p className={`${style.paragraph}`}>
            YOU ACKNOWLEDGE AND AGREE THAT WE MAY GENERATE REVENUES, INCREASE GOODWILL OR OTHERWISE
            INCREASE OUR VALUE FROM YOUR USE OF THE SERVICES, INCLUDING, BY WAY OF EXAMPLE AND NOT
            LIMITATION, THROUGH TOKENIZATION AND/OR COMMERCIALIZATION ACTIVITIES, INCLUDING BUT NOT
            LIMITED TO, THE SALE OF ADVERTISING, SPONSORSHIPS, PROMOTIONS, USAGE DATA AND GIFTS AND
            EXCEPT AS SPECIFICALLY PERMITTED BY US IN THESE TERMS OR IN ANOTHER AGREEMENT YOU ENTER
            INTO WITH US, YOU WILL HAVE NO RIGHT TO SHARE IN ANY SUCH REVENUE, GOODWILL OR VALUE
            WHATSOEVER. WE MAY ALSO CHARGE YOU WITH CERTAIN FEES WHEN YOU USE OUR PLATFORM TO SELL A
            CONTENT.
          </p>
          <p className={`${style.paragraph}`}>
            YOU FURTHER ACKNOWLEDGE THAT, EXCEPT AS SPECIFICALLY PERMITTED BY US IN THESE TERMS OR
            IN ANOTHER AGREEMENT YOU ENTER INTO WITH US, YOU (I) HAVE NO RIGHT TO RECEIVE ANY INCOME
            OR OTHER CONSIDERATION FROM ANY USER CONTENT (DEFINED BELOW) OR YOUR USE OF ANY MUSICAL
            WORKS, SOUND RECORDINGS OR AUDIOVISUAL CLIPS MADE AVAILABLE TO YOU ON OR THROUGH THE
            SERVICES, INCLUDING IN ANY USER CONTENT CREATED BY YOU, AND (II) ARE PROHIBITED FROM
            EXERCISING ANY RIGHTS TO MONETIZE OR OBTAIN CONSIDERATION FROM ANY USER CONTENT WITHIN
            THE SERVICES OR ON ANY THIRD PARTY SERVICE (INCLUDING, WITHOUT LIMITATION, REDDIT,
            FACEBOOK, INSTAGRAM, TWITTER, YOUTUBE OR ANY OTHER SOCIAL MEDIA PLATFORM) TO THE EXTENT
            THAT SUCH USER CONTENT HAS BEEN IN ANY WAY EDITED OR OTHERWISE ALTERED THROUGH THE
            SERVICES (INCLUDING THROUGH THE USE OF MYRIAD ELEMENTS).
          </p>
          <h2>
            <li>MYRIAD FEDERATION</li>
          </h2>
          <p className={`${style.paragraph}`}>
            You may use the Service or install any Myriad element only at Your facilities at Your
            direct possession or control. You must be appropriately licensed as stated in these
            Terms for any individual that uses Your service. We grant you a non-exclusive,
            non-transferable, perpetual (except for subscription based licenses) to use our Service
            or install any Myriad element subject to and in accordance with the terms of this
            agreement and strictly adopt licensing requirement under GNU AFFERO GENERAL PUBLIC
            LICENSE [https://www.gnu.org/licenses/agpl-3.0-standalone.html. You must not: (i) lease,
            loan, resell, sublicense or otherwise distribute the Myriad materials; (ii) distribute
            or publish keycode(s); (iii) make any use of the Service or Platform or Myriad element
            with respect to these Terms other than as expressly permitted in accordance with these
            Terms.
          </p>
          <p className={`${style.paragraph}`}>
            With Myriad’s prior written consent, You may permit any third party to access the
            Service or Platform solely for the purpose of providing facility, implementation,
            systems, application management or disaster recovery services to You in connection with
            Your usage of Myriad federation server for which the Service or Platform is herein
            licensed provided: (i) these rights will continue only while You and such third party
            have in place a written agreement that includes provisions requiring such third party’s
            compliance with these Terms prior to such access; (ii) You must be appropriately
            licensed for all employees of such third party authorized to access the Service or
            Platform; (iii) such third party shall be permitted to use the Service or Platform
            solely to install and configure the Service or Platform in accordance with the Your
            usage of Myriad federation serve as set forth herein (or in the case of a disaster
            recovery vendor, to provide disaster recovery services only); (iv) under no
            circumstances may such the third party use the Service or Platform to operate or provide
            processing services to You or any other party, or in connection with such third party’s
            own business operations; (v) You shall be responsible for any additional software,
            migration tools, or third party software needed to effect such transition.
          </p>
          <h2>
            <li>CRYPTO CURRENCY POLICY</li>
          </h2>
          <p className={`${style.paragraph}`}>
            As a Myriad’s User, you may be provided or obtained, a Myriad Token ($MYRIA) subject to
            the terms and conditions set out under this section. Myriad token is a digital asset
            designed to work as a utility token that provides access to Myriad’s products and
            services, including Myriad Platform. You may also send a tip using a cryptocurrency on
            our Platform in accordance with these Terms.
          </p>
          <p className={`${style.paragraph}`}>
            <b>Who can obtain Myriad Token?</b>
          </p>
          <p className={`${style.paragraph}`}>
            User of our Services may obtain (or in some condition: purchase) a Myriad Token from us
            using authorized issuers, exchangers, or providers made available and authorized by us.
          </p>
          <p className={`${style.paragraph}`}>
            In the event that You purchase Myriad Token and Exchange Rate, the following conditions
            apply:
          </p>
          <ul>
            <li>
              The price of the Myriad Token will be displayed at the point of purchase. All charges
              and payments for Myriad Token will be made in the currency specified at the point of
              purchase through the relevant payment mechanism. Currency exchange settlements,
              foreign transaction fees and payment channel fees, if any, are based on your agreement
              with the applicable payment provider.
            </li>
            <li>
              You will be responsible for the payment of any Myriad Token purchased by you. Once
              your purchase has been completed, your Myriad Account will be credited with Myriad
              Token.
            </li>
            <li>
              When buying a Myriad Token, you understand that it has a monetary value that can be
              fluctuated. Therefore, if you wish to exchange your Myriad Token to other
              cryptocurrency and/or fiat currency, the currency exchange settlements will be subject
              to the rate at the point of exchange. You are also able to convert other
              cryptocurrencies that you own into a Myriad Token. You understand and agree that the
              exchange rate will also be subject to the rate at the point when you are making an
              exchange.
            </li>
            <li>
              If you wish to make changes to your purchase, please contact us. We will let you know
              if this change is possible. Please note that changes may impact price as well as other
              aspects of your purchase. If you purchase Myriad Token, you acknowledge and agree that
              we start supplying the Myriad Token to you as soon as the purchase is complete and
              therefore, your right to cancel or withdraw from the agreement to purchase is lost at
              this point.
            </li>
          </ul>
          <p className={`${style.paragraph}`}>
            <b>Where You Can Use Myriad Token</b>
          </p>
          <ul>
            <li>
              You may use your Myriad Token balance to acquire or (in some events: buy) certain
              Content and/or send to other Myriad’s User. Myriad Token can be exchanged to a
              specific fiat currency as would be provided under the Services.
            </li>
            <li>
              Content that can be acquired or bought using Myriad Token is subject to other Myriad’s
              User consent.
            </li>
            <li>
              Accrued Myriad Token constitute a property and transferable: (a) upon death; (b) as
              part of a domestic relations matter; or (c) otherwise by operation of law.
            </li>
            <li>
              All Myriad Token of a user will expire automatically upon termination of the User’s
              account for any reason. In such cases, you must exchange your remaining Myriad Token
              balance to other cryptocurrency, token, or fiat currency.
            </li>
          </ul>
          <h2>
            <li>INDEMNITY</li>
          </h2>
          <p className={`${style.paragraph}`}>
            You agree to defend, indemnify, and hold harmless Myriad, its parents, subsidiaries, and
            affiliates, and each of their respective officers, directors, employees, agents and
            advisors from any and all claims, liabilities, costs, and expenses, including, but not
            limited to, attorneys’ fees and expenses, arising out of a breach by you or any user of
            your account of these Terms or arising out of a breach of your obligations,
            representation and warranties under these Terms.
          </p>
          <h2>
            <li>EXCLUSION OF WARRANTIES</li>
          </h2>
          <p className={`${style.paragraph}`}>
            THE SERVICES ARE PROVIDED “AS IS” AND WE MAKE NO WARRANTY OR REPRESENTATION TO YOU WITH
            RESPECT TO THEM. IN PARTICULAR WE DO NOT REPRESENT OR WARRANT TO YOU THAT:
          </p>
          <ol>
            <li>YOUR USE OF THE SERVICES WILL MEET YOUR REQUIREMENTS;</li>
            <li>
              YOUR USE OF THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE OR FREE FROM ERROR;
            </li>
            <li>
              ANY INFORMATION OBTAINED BY YOU AS A RESULT OF YOUR USE OF THE SERVICES WILL BE
              ACCURATE OR RELIABLE; AND
            </li>
            <li>
              DEFECTS IN THE OPERATION OR FUNCTIONALITY OF ANY SOFTWARE PROVIDED TO YOU AS PART OF
              THE SERVICES WILL BE CORRECTED.
            </li>
          </ol>
          <p className={`${style.paragraph}`}>
            NO CONDITIONS, WARRANTIES OR OTHER TERMS (INCLUDING ANY IMPLIED TERMS AS TO SATISFACTORY
            QUALITY, FITNESS FOR PURPOSE OR CONFORMANCE WITH DESCRIPTION) APPLY TO THE SERVICES
            EXCEPT TO THE EXTENT THAT THEY ARE EXPRESSLY SET OUT IN THE TERMS. WE MAY CHANGE,
            SUSPEND, WITHDRAW OR RESTRICT THE AVAILABILITY OF ALL OR ANY PART OF OUR PLATFORM FOR
            BUSINESS AND OPERATIONAL REASONS AT ANY TIME WITHOUT NOTICE.
          </p>
          <h2>
            <li>LIMITATION OF LIABILITY</li>
          </h2>
          <p className={`${style.paragraph}`}>WE SHALL NOT BE LIABLE TO YOU FOR:</p>
          <ol>
            <li>ANY LOSS OF PROFIT (WHETHER INCURRED DIRECTLY OR INDIRECTLY);</li>
            <li>ANY LOSS OF GOODWILL;</li>
            <li>ANY LOSS OF OPPORTUNITY;</li>
            <li>ANY LOSS OF DATA SUFFERED BY YOU; OR</li>
            <li>
              ANY INDIRECT OR CONSEQUENTIAL LOSSES WHICH MAY BE INCURRED BY YOU. ANY OTHER LOSS WILL
              BE LIMITED TO THE AMOUNT PAID BY YOU TO MYRIAD WITHIN THE LAST 12 MONTHS.
            </li>
            <li>ANY LOSS OR DAMAGE WHICH MAY BE INCURRED BY YOU AS A RESULT OF: </li>
            <ul>
              <li>
                ANY RELIANCE PLACE BY YOU ON THE COMPLETENESS ACCURACY OR EXISTENCE OF ANY
                ADVERTISING, OR AS A RESULT OF ANY RELATIONSHIP OR TRANSACTION BETWEEN YOU AND ANY
                ADVERTISER OR SPONSOR WHOSE ADVERTISING APPEARS ON THE SERVICE;
              </li>
              <li>
                ANY CHANGES WHICH WE MAY MAKE TO THE SERVICES, OR FOR ANY PERMANENT OR TEMPORARY
                CESSATION IN THE PROVISION OF THE SERVICES (OR ANY FEATURES WITHIN THE SERVICES);
              </li>
              <li>
                THE DELETION OF, CORRUPTION OF, OR FAILURE TO STORE, ANY CONTENT AND OTHER
                COMMUNICATIONS DATA MAINTAINED OR TRANSMITTED BY OR THROUGH YOUR USE OF THE
                SERVICES;
              </li>
              <li>YOUR FAILURE TO PROVIDE US WITH ACCURATE ACCOUNT INFORMATION; OR</li>
              <li>
                YOUR FAILURE TO KEEP YOUR PASSWORD OR ACCOUNT DETAILS SECURE AND CONFIDENTIAL.
              </li>
            </ul>
          </ol>
          <p className={`${style.paragraph}`}>
            PLEASE NOTE THAT WE ONLY PROVIDE OUR PLATFORM FOR DOMESTIC AND PRIVATE USE. SHOULD YOU
            USE OUR PLATFORM FOR COMMERCIAL PURPOSE, WE HAVE NO LIABILITY TO YOU FOR ANY LOSS OF
            PROFIT, LOSS OF BUSINESS, LOSS OF GOODWILL OR BUSINESS REPUTATION, BUSINESS
            INTERRUPTION, OR LOSS OF BUSINESS OPPORTUNITY.
          </p>
          <p className={`${style.paragraph}`}>
            IF DEFECTIVE DIGITAL CONTENT THAT WE HAVE SUPPLIED DAMAGES A DEVICE OR DIGITAL CONTENT
            BELONGING TO YOU AND THIS IS CAUSED BY OUR FAILURE TO USE REASONABLE CARE AND SKILL, WE
            WILL EITHER REPAIR THE DAMAGE OR PAY YOU COMPENSATION. HOWEVER, WE WILL NOT BE LIABLE
            FOR DAMAGE THAT YOU COULD HAVE AVOIDED BY FOLLOWING OUR ADVICE TO APPLY AN UPDATE
            OFFERED TO YOU FREE OF CHARGE OR FOR DAMAGE THAT WAS CAUSED BY YOU FAILING TO CORRECTLY
            FOLLOW INSTALLATION INSTRUCTIONS OR TO HAVE IN PLACE THE MINIMUM SYSTEM REQUIREMENTS
            ADVISED BY US.
          </p>
          <p className={`${style.paragraph}`}>
            THESE LIMITATIONS ON OUR LIABILITY TO YOU SHALL APPLY WHETHER OR NOT WE HAVE BEEN
            ADVISED OF OR SHOULD HAVE BEEN AWARE OF THE POSSIBILITY OF ANY SUCH LOSSES ARISING.
          </p>
          <p className={`${style.paragraph}`}>
            YOU ARE RESPONSIBLE FOR ANY MOBILE CHARGES THAT MAY APPLY TO YOUR USE OF OUR SERVICE,
            INCLUDING TEXT-MESSAGING AND DATA CHARGES. IF YOU’RE UNSURE WHAT THOSE CHARGES MAY BE,
            YOU SHOULD ASK YOUR SERVICE PROVIDER BEFORE USING THE SERVICE.
          </p>
          <p className={`${style.paragraph}`}>
            TO THE FULLEST EXTENT PERMITTED BY LAW, ANY DISPUTE YOU HAVE WITH ANY THIRD PARTY
            ARISING OUT OF YOUR USE OF THE SERVICES, INCLUDING, BY WAY OF EXAMPLE AND NOT
            LIMITATION, ANY CARRIER, COPYRIGHT OWNER OR OTHER USER, IS DIRECTLY BETWEEN YOU AND SUCH
            THIRD PARTY, AND YOU IRREVOCABLY RELEASE US AND OUR AFFILIATES FROM ANY AND ALL CLAIMS,
            DEMANDS AND DAMAGES (ACTUAL AND CONSEQUENTIAL) OF EVERY KIND AND NATURE, KNOWN AND
            UNKNOWN, ARISING OUT OF OR IN ANY WAY CONNECTED WITH SUCH DISPUTES.
          </p>
          <h2>
            <li>ARBITRATION</li>
          </h2>
          <p className={`${style.paragraph}`}>
            This Section includes an arbitration agreement and an agreement that all claims will be
            brought only in an individual capacity (and not as a class action or other
            representative proceeding). Please read it carefully.
          </p>
          <p className={`${style.paragraph}`}>
            <b>Informal Process First</b>. You agree that in the event of any dispute between you
            and Myriad, you will first contact Myriad and make a good faith sustained effort to
            resolve the dispute before resorting to more formal means of resolution, including
            without limitation any court action. This information dispute resolution should apply
            for the period of 30 (thirty) calendar days as of a dispute or claim received by us.{' '}
          </p>
          <p className={`${style.paragraph}`}>
            <b>Arbitration Agreement</b>. After the informal dispute resolution process any
            remaining dispute, controversy, or claim (collectively, “<b>Claim</b>”) relating in any
            way to your use of Myriad’s services and/or products, including the Services, or
            relating in any way to the communications between you and Myriad or any other user of
            the Services, will be finally resolved by binding arbitration. This mandatory
            arbitration agreement applies equally to you and Myriad. However, this arbitration
            agreement does not (a) govern any Claim by Myriad for infringement of its intellectual
            property or access to the Services that is unauthorized or exceeds authorization granted
            in these Terms or (b) bar you from making use of applicable small claims court
            procedures in appropriate cases. You agree that the Vilnius Court of Commercial
            Arbitration in in Vilnius, Lithuania (hereinafter: the Arbitration Court) governs the
            interpretation and enforcement of this provision, and that you and Myriad are each
            waiving the right to a trial by jury or to participate in a class action. This
            arbitration provision will survive any termination of these Terms. If you wish to begin
            an arbitration proceeding, after following the informal dispute resolution procedure,
            you must send a letter requesting arbitration and describing your claim by contacting
            us.
          </p>
          <p className={`${style.paragraph}`}>
            The arbitration will be administered by the Arbitration Court under its rules. You are
            responsible for all filing, administration and arbitrator fees.{' '}
          </p>
          <p className={`${style.paragraph}`}>
            <b>Class Action Waiver</b>. Any Claim must be brought in the respective party’s
            individual capacity, and not as a plaintiff or class member in any purported class,
            collective, representative, multiple plaintiff, or similar proceeding (“
            <b>Class Action</b>”). The parties expressly waive any ability to maintain any Class
            Action in any forum. If the Claim is subject to arbitration, the arbitrator will not
            have authority to combine or aggregate similar claims or conduct any Class Action nor
            make an award to any person or entity not a party to the arbitration. Any claim that all
            or part of this Class Action Waiver is unenforceable, unconscionable, void, or voidable
            may be determined only by a court of competent jurisdiction and not by an arbitrator.
            The parties understand that any right to litigate in court, to have a judge or jury
            decide their case, or to be a party to a class or representative action, is waived, and
            that any claims must be decided individually, through arbitration.
          </p>
          <h2>
            <li>CONTACT US</li>
          </h2>
          <p className={`${style.paragraph}`}>
            You can reach or notify us at:&nbsp;
            <a href={`mailto:${publicRuntimeConfig.myriadSupportMail}`} className={style.link}>
              {publicRuntimeConfig.myriadSupportMail}
            </a>
          </p>
          <h2>
            <li>PRIVACY</li>
          </h2>
          <p className={`${style.paragraph}`}>
            We will only use your personal information as set out in our&nbsp;
            <Link href={`/privacy-policy`}>
              <a href={`/privacy-policy`} className={style.link}>
                Privacy Policy Page
              </a>
            </Link>
            .
          </p>
          <h2>
            <li>GENERALS</li>
          </h2>
          <p className={`${style.paragraph}`}>
            <b>Not Marketplace Platform</b>. We are not a buy and sell or online marketplace
            platform, but User can do sale activities and any activity with NFTs, Crypto Currencies,
            and/or Myriad token on the Platform.
          </p>
          <p className={`${style.paragraph}`}>
            <b>Assignment and other dealings</b>. We reserve the right to transfer our rights and
            obligations under these terms to another organization. We will ensure that the transfer
            will not materially affect your rights under the contract.
          </p>
          <p className={`${style.paragraph}`}>
            <b>Entire Agreement</b>. These Terms constitute the whole legal agreement between you
            and Myriad and govern your use of the Services and completely replace any prior
            agreements between you and Myriad in relation to the Services.
          </p>
          <p className={`${style.paragraph}`}>
            <b>Links</b>. You may link to our home page, provided you do so in a way that is fair
            and legal and does not damage our reputation or take advantage of it. You must not
            establish a link in such a way as to suggest any form of association, approval or
            endorsement on our part where none exists. You must not establish a link to our Services
            in any website that is not owned by you. We reserve the right to withdraw linking
            permission without notice.
          </p>
          <p className={`${style.paragraph}`}>
            <b>No Waiver</b>. Our failure to insist upon or enforce any provision of these Terms
            shall not be construed as a waiver of any provision or right.
          </p>
          <p className={`${style.paragraph}`}>
            <b>Security</b>. We do not guarantee that our Services will be secure or free from bugs
            or viruses. You are responsible for configuring your information technology, computer
            programmes and platform to access our Platform. You should use your own virus protection
            software.
          </p>
          <p className={`${style.paragraph}`}>
            <b>Severability</b>. If any court of law, having jurisdiction to decide on this matter,
            rules that any provision of these Terms is invalid, then that provision will be removed
            from the Terms without affecting the rest of the Terms, and the remaining provisions of
            the Terms will continue to be valid and enforceable.
          </p>
          <p className={`${style.paragraph}`}>
            <b>Governing Law</b>. These Terms and any dispute or claim (including non-contractual
            disputes or claims) arising out of or in connection with it or its subject matter or
            formation shall be governed by and construed in accordance with the laws of the Republic
            of Lithuania.
          </p>
        </ol>
      </div>
    </Paper>
  );
};

export default TermOfUse;

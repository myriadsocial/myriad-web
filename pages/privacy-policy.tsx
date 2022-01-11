import React from 'react';

import getConfig from 'next/config';
import Link from 'next/link';

import {Paper} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import MyriadIcon from 'src/images/web/myriad.svg';

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

const PrivacyPolicy: React.FC = () => {
  const style = useStyles();

  return (
    <Paper className={style.root}>
      <MyriadIcon />
      <div className={style.content}>
        <h1 className={`${style.center} ${style.title}`}>Privacy Policy</h1>
        <p className={`${style.paragraph}`}>
          [Please note that this privacy policy may be subject to changes in accordance with the
          local data protection laws applicable in certain jurisdictions. We advise to also consult
          with other local counsel shall Myriad be offered in other jurisdictions with strict data
          protection laws, such as Lithuania, etc. before offering Myriad service in that particular
          country]
        </p>
        <p className={`${style.paragraph}`}>
          In order to provide you with the best experience when using our system or service, we may
          collect, use, disclose, process and protect your personal identifiable information. Our
          system is owned and operated by Myriad.Social (<b>&quot;Myriad&quot;</b>,{' '}
          <b>&quot;us&quot;</b>, <b>&quot;we&quot;</b>, or
          <b>&quot;our&quot;</b>). We are the controller and responsible for your information
          subject to this Privacy Policy.
        </p>
        <p className={`${style.paragraph}`}>
          We believe you should be informed about what kind of information we collect and how we use
          it in our system, both through our website and/or app (the <b>&quot;Site&quot;</b>). By
          reading this Privacy Policy, you can always make the best decision about the personal data
          that you share with us. Information here refers to any information which is related to an
          identified or identifiable natural person (<b>&quot;Information&quot;</b>
          ).
        </p>
        <p className={`${style.paragraph}`}>
          By registering to and/ or using the Site, you acknowledge that you have read this Privacy
          Policy and the [
          <Link href={`/term-of-use`}>
            <a href={`/term-of-use`} className={style.link}>
              Terms of Use
            </a>
          </Link>
          ] and understand their content and consequences, and you agree and give consent to Us for
          the collection, use, disclosure and processing of your Information in accordance with this
          Privacy Policy and/or the Terms of Use. Further, you acknowledge that every Information
          that you have provided or will provide is yours to share and is true and accurate.
        </p>
        <p className={`${style.paragraph}`}>
          From time to time, we may revise this Privacy Policy to reflect changes in the laws and
          regulations, our use practices, the features of our Site and/or advances in technology. If
          we make revisions that change the way we collect or use your Information, those changes
          will be posted in this Privacy Policy and the effective date will be noted at the
          beginning of this Privacy Policy. Therefore, you should review this Privacy Policy
          periodically so that you are up to date on our most current policies and practices.
        </p>
        <p className={`${style.paragraph}`}>
          If you do not agree with any changes or modifications to the Privacy Policy, please do not
          continue using the Site. You will be deemed to have consented to any modification of the
          Privacy Policy when you use the Site after the effective date of the modification.
        </p>
        <p className={`${style.paragraph}`}>This Privacy Policy explains about:</p>
        <ul>
          <li>Information We Collect</li>
          <li>How We Use Your Information</li>
          <li>Sharing of Your Information</li>
          <li>Access to or Correction of Your Information</li>
          <li>Withdrawing Consent</li>
          <li>Removal of Your Information</li>
          <li>Retention of Your Information</li>
          <li>Protection of Your Information</li>
          <li>Links to Other Websites</li>
          <li>Transfer or Cessation of Business</li>
          <li>Complaints</li>
          <li>Our Contact Details</li>
        </ul>
        <ol>
          <h2>
            <li>Information We Collect</li>
          </h2>

          <p className={`${style.paragraph}`}>
            We respect your privacy and are committed to protecting it through our compliance with
            this Privacy Policy. We collect information on the Platform which is not necessarily
            related to you or your personal information as described below.
          </p>
          <ul>
            <li>
              <b>Basic Account Information</b>: You don’t have to create an account to use some of
              our service features, such as searching and viewing public Myriad profiles, watching
              videos, browsing photos, and scrolling through other people’s posts, on websites or
              mobile applications. If you do choose to create a Myriad account, you must provide us
              with your chosen username, preferably , pseudonymous or anonymous information rather
              than your personal name.. On Myriad, your username and its related information are
              used to display your Myriad account on the Platform. Your display name, username,
              and/or any other information you posted on our Site are always public and subject to
              reuse by Us or other users.
            </li>
            <li>
              <b>Website Interaction</b>: we may collect information based on your experiences in
              using the Site, for example: details of your activity in the Site such as likes, post,
              experiences, comments, digital token/cryptocurrency transfers/sales, tipping,
              meta-social tipping, chatting, or connecting our Services with other sites.
            </li>
            <li>
              <b>Web Logs</b>: We may collect information, including your browser type, operating
              system, Internet Protocol (IP) address (a number that is automatically assigned to a
              computer when the Internet is used), domain name, click-activity, referring website,
              and/or a date/time stamp for visitors.
            </li>
          </ul>
          <p className={`${style.paragraph}`}>
            We also collect, use and share Aggregated Data such as statistical or demographic data
            for any purpose. Aggregated Data could be derived from your information but is not
            considered information in law as this data will not directly or indirectly reveal your
            identity.
          </p>
          <p className={`${style.paragraph}`}>
            We do not collect any Special Categories of Information about you (this includes details
            about your race or ethnicity, religious or philosophical beliefs, sex life, sexual
            orientation, political opinions, trade union membership, information about your health,
            and genetic and biometric data). Nor do we collect any information about criminal
            convictions and offences.
          </p>
          <h2>
            <li>How We Use Your Information</li>
          </h2>
          <p className={`${style.paragraph}`}>
            We may also collect, hold, use and disclose your Information to offer you the best
            packages that will be suitable for your preferences. In addition, we may also collect,
            hold, use and disclose your Information for the following purposes:
          </p>
          <ol>
            <li>registering your use of, and access to, the Site;</li>
            <li>improving our services and website;</li>
            <li>enforcing the provisions of the Myriad Terms of Use;</li>
            <li>resolving disputes, collecting outstanding payment and troubleshooting;</li>
            <li>conducting analytics.</li>
          </ol>
          <p className={`${style.paragraph}`}>
            Please note that we may process your information without your knowledge or consent, in
            compliance with the above rules, where this is required or permitted by law. For
            instance, we have a legitimate interest in making our website operate efficiently.
          </p>
          <h2>
            <li>Sharing Information</li>
          </h2>
          <p className={`${style.paragraph}`}>
            Your Information may be shared by us with other companies, organizations and individuals
            (each a <b>&quot;Third Party&quot;</b>) in connection with providing our services to you
            and to our other customers and for the other purposes set out in this Privacy Policy.
            Your Information may also be shared to our other subsidiaries and/or affiliated
            companies.
          </p>
          <p className={`${style.paragraph}`}>
            Myriad may also transfer your Information to Third Parties located overseas.
          </p>
          <p className={`${style.paragraph}`}>
            Please note that Myriad may disclose your Information subject to the following
            conditions:
          </p>
          <ul>
            <li>
              <b>Consent and other legal basis</b>: We will only share your Information with the
              Third Parties when we have your consent to do so or we have adopted appropriate legal
              basis of processing, such as necessary for the performance of a contract, a vital
              interest, a legal requirement, and/or our legitimate interest subject to applicable
              laws and regulations. You agree that your use of our services will constitute your
              consent and that the sharing of your Information will be subject to this Privacy
              Policy.
            </li>
            <li>
              <b>For Legal Reasons</b>: We may also, in our absolute discretion, share your
              Information with Third Parties (including government agencies, law enforcement, and
              lawyers and other advisers) if we consider this is necessary to: i) comply with
              applicable laws and regulations; ii) investigate any potential fraud or illegal acts;
              or iii) protect our brand, our reputation and our property.
            </li>
          </ul>
          <h2>
            <li>Access to or Correction of Your Information</li>
          </h2>
          <p className={`${style.paragraph}`}>
            You may update your Information through your account in a timely manner, should there be
            any changes. Please note that Your “Username” cannot be changed after you created.
          </p>
          <p className={`${style.paragraph}`}>
            If you wish to correct an error or omission in any of your Information held by us which
            cannot be corrected via your account on the Site, or to access your Information held by
            us which cannot be accessed via your account on the Site, please submit your request to
            our contact details listed below.
          </p>
          <h2>
            <li>Withdrawing Consent</li>
          </h2>
          <p className={`${style.paragraph}`}>
            Where we have obtained your consent for any collecting, use or disclosure as indicated
            above, you may withdraw your consent to our collection, use or disclosure of your
            Information, by giving us a reasonable notice. If you wish to withdraw your consent,
            please inform us. Upon your request, we will cease to collect, use or disclose your
            Information, unless required by the laws or if we have legitimate business or legal
            purposes for collecting, using or disclosing such Information. Note that by withdrawing
            your consent to our collection, use or disclosure of your Information, we may not be
            able to continue providing you with some of our services and you agree that we will not
            be liable to you for any losses or damages arising out of or in relation to such
            termination of services.
          </p>
          <h2>
            <li>Removal of Your Information and Your Legal Rights</li>
          </h2>
          <p className={`${style.paragraph}`}>
            To the extent permitted by applicable law, you may have the right to request us to
            remove your Information that we hold from our systems, and you should inform us at our
            contact details listed below.
          </p>
          <p className={`${style.paragraph}`}>
            Upon your request, we will strive to remove your Information from our systems, unless we
            are permitted or required by applicable laws to do otherwise. We will also cease to
            collect, use or disclose your Information, unless otherwise permitted or required by
            applicable law Note that by requesting us to remove your Information, we may not be able
            to continue providing you with our services.
          </p>
          <p className={`${style.paragraph}`}>
            Under certain circumstances, you have rights under data protection laws in relation to
            your information, such as, request to access, request correction, and object to
            processing. If you wish to exercise any of the rights set out above, please contact us.
          </p>
          <p className={`${style.paragraph}`}>
            You will not have to pay a fee to access your information (or to exercise any of the
            other rights). However, we may charge a reasonable fee if your request is clearly
            unfounded, repetitive or excessive. Alternatively, we could refuse to comply with your
            request in these circumstances.
          </p>
          <h2>
            <li>Retention of Your Information</li>
          </h2>
          <p className={`${style.paragraph}`}>
            Unless we remove your Information from our systems following the receipt of a request
            from you, your Information will be retained by us for as long as your account is in
            existence and as needed to provide you with our services. We shall cease to retain
            Information, or will use reasonable efforts to remove the means by which the Information
            can be associated with you as an individual, as soon as, 1) the purpose for which
            Information was collected is no longer being served by the retention of that
            Information; and 2) we are not otherwise permitted or required by applicable law to
            retain the Information.
          </p>
          <h2>
            <li>Protection of Your Information</li>
          </h2>
          <p className={`${style.paragraph}`}>
            We will protect your Information by maintaining reasonable effort in our sole and
            absolute discretion, including physical, technical and organizational procedures, to
            prevent unauthorized access, collection, use, disclosure, copying, modification,
            disposal or similar risks. If we are subject to a data breach that relates to your
            Information, to the extent required by applicable law, we will notify you through our
            channels, whether directly or indirectly, to give you sufficient information regarding
            such data breach and will work to protect against the misuse of your Information. While
            we use reasonable efforts to protect your Information from unauthorized access, use, or
            disclosure, we cannot guarantee the security of your Information.
          </p>
          <h2>
            <li>Links to Other Websites</li>
          </h2>
          <p className={`${style.paragraph}`}>
            The Site may contain links to other websites. You should note that we do not have any
            control over such other websites. Please note that we are not responsible for the
            privacy policy or practices of such other websites and advise you to read the privacy
            policy of each website you visit which collects any of your Information.
          </p>
          <h2>
            <li>Transfer or Cessation of Business</li>
          </h2>
          <p className={`${style.paragraph}`}>
            In the event of change of control or ownership of Myriad&apos;s business or group of
            companies (or a potential change of control or ownership), then your Information may be
            disclosed and transferred as part of the transaction or potential transaction. In the
            event of cessation Myriad’s business, then your Information will be erased permanently
            from our system.
          </p>
          <h2>
            <li>Complaints</li>
          </h2>
          <p className={`${style.paragraph}`}>
            If you have a complaint regarding the treatment of your Information by us, please
            contact us. We will treat your complaint confidentially. We will contact you within a
            reasonable time after receipt of your complaint to discuss it and to outline options
            regarding how your complaint may be resolved. If you have a complaint regarding the
            treatment of your Information that is not resolved by us, you may be able to make a
            complaint to the relevant regulatory authority.
          </p>
          <h2>
            <li>Our Contact Details</li>
          </h2>
          <p className={`${style.paragraph}`}>
            <b>
              If you have any questions or requests relating to this Privacy Policy, please contact
              our information officer at&nbsp;
              <a href={`mailto:${publicRuntimeConfig.myriadSupportMail}`} className={style.link}>
                {publicRuntimeConfig.myriadSupportMail}
              </a>
            </b>
          </p>
        </ol>
      </div>
    </Paper>
  );
};

export default PrivacyPolicy;

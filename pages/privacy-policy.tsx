import React from 'react';

import Link from 'next/link';

import {Paper} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import MyriadIcon from 'src/images/web/myriad.svg';

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
        <h3 className={`${style.center} ${style.subtitle}`}>Subject to Change</h3>
        <p className={`${style.paragraph}`}>
          [Please be noted that this privacy policy may be subject to changes in accordance with the
          local data protection laws applicable in certain jurisdictions. We advised to also consult
          with other local counsel if Myriad will be offered in other jurisdictions that has strict
          data protection laws, such as Estonia, etc. before offering Myriad service in that
          particular country]
        </p>
        <p className={`${style.paragraph}`}>
          In order to provide you with the best experience when using our system or service, we may
          collect, use, disclose, process and protect your personal identifiable information or
          personal data. Our system is owned and operated by Myriad.Social (
          <b>&quot;Myriad&quot;</b>, <b>&quot;us&quot;</b>, <b>&quot;we&quot;</b>, or
          <b>&quot;our&quot;</b>). We are the controller and responsible for your personal data
          subject to this Privacy Policy.
        </p>
        <p className={`${style.paragraph}`}>
          We believe you should be informed about what kind of personal data we collect and how we
          use it in our system, both through our website and/or app (the <b>&quot;Site&quot;</b>).
          By reading this Privacy Policy, you can always make the best decision about the personal
          data that you share with us. Personal data here refers to any information which are
          related to an identified or identifiable natural person (<b>&quot;Personal Data&quot;</b>
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
          the collection, use, disclosure and processing of your Personal Data in accordance with
          this Privacy Policy and/or the Terms of Use. Further, you acknowledge that every Personal
          Data that you have provided or will provide is yours to share and is true and accurate.
        </p>
        <p className={`${style.paragraph}`}>
          This website is not intended for children and we do not knowingly collect data relating to
          children.
        </p>
        <p className={`${style.paragraph}`}>
          From time to time, we may revise this Privacy Policy to reflect changes in the laws and
          regulations, our use practices, the features of our Site and/or advances in technology. If
          we make revisions that change the way we collector use your Personal Data, those changes
          will be posted in this Privacy Policy and the effective date will be noted at the
          beginning of this Privacy Policy. Therefore, you should review this Privacy Policy
          periodically so that you are up to date on our most current policies and practices. If you
          do not agree with any changes or modifications to the Privacy Policy, please do not
          continue using the Site. You will be deemed to have consented to any modification of the
          Privacy Policy when you use the Site after the effective date of the modification.
        </p>
        <p className={`${style.paragraph}`}>This Privacy Policy explains about:</p>
        <ul>
          <li>Personal Data We Collect</li>
          <li>How We Use Your Personal Data</li>
          <li>Sharing of Your Personal Data</li>
          <li>Access to or Correction of Your Personal Data</li>
          <li>Withdrawing Consent</li>
          <li>Removal of Your Personal Data</li>
          <li>Retention of Your Personal Data</li>
          <li>Protection of Your Personal Data</li>
          <li>Links to Other Websites</li>
          <li>Transfer or Cessation of Business</li>
          <li>Complaints</li>
          <li>Our Contact Details</li>
        </ul>
        <ol>
          <h2>
            <li>Personal Data We Collect</li>
          </h2>

          <p className={`${style.paragraph}`}>
            We may collect, hold, use and disclose your Personal Data to provide our services to
            you. In addition, we may also collect, hold, use and disclose your Personal Data for
            other reasons as provided further in this Privacy Policy. Your Personal Data that we
            collect, hold, use and disclose consists of the information described below.
          </p>
          <ul>
            <li>
              <b>Basic Account Information</b>: You don’t have to create an account to use some of
              our service features, such as searching and viewing public Myriad profiles, watching
              videos, browsing photos, and scrolling through other people’s post, on website or
              mobile application. If you do choose to create a Myriad account, you must provide us
              with your chosen username, either your personal data, pseudonymous or anonymous
              information so that we can provide our services to you. On Myriad this includes a
              display your Myriad account, username, and other contact. Your display name and
              username are always public, but you can use either your real name or a pseudonym.
            </li>
            <li>
              <b>Specific Personal Information</b>: we may collect information based on your
              experiences in using the Site, for example: details of your activity in the Site such
              as likes, post, experiences, comments, digital token/cryptocurrency transfers/sales,
              tipping, meta-social tipping, chatting, or connecting our Services with other sites.
              We may also collect certain information from you when you are using the Site, such as
              geographic location, IP address, search preferences as well as other Internet usage
              related data as follows [MYRIAD to confirm the following]:
            </li>
            <ul>
              <li>
                <b>Profile Data</b> includes your username and password, purchases or orders made by
                you, your interests, preferences, feedback and survey responses.
              </li>
              <li>
                <b>Geographic location</b>: we may collect information about your actual location,
                whether or not you are using the Site, to provide you with the offers in the
                relevant location as provided in the Site. We may also derive your approximate
                location from your IP address and GPS and other information provided from your
                mobile device.
              </li>
              <li>
                <b>Log Information</b>: when you are using the Site, we may collect information
                which we refer to as &quot;log information&quot;. The log information may be
                collected even though you do not create an account on the Site. This log information
                may include IP address, browser type, operating system, nationality, pages visited,
                your mobile carrier, device information and search history as well as other Internet
                usage related information. We use the log information to provide you with a better
                experience using the Site.
              </li>
              <li>
                <b>Cookies and similar technologies</b>: we may use cookies and similar technologies
                (such as web beacons, tags, scripts) to collect information. A cookie is a small
                piece of data that is stored in your computer or mobile device to help us track your
                Internet usage. Like other websites, we may use cookies to give you a better
                experience using the Site and so the Site will recognize you when you use the Site
                in future. Please deactivate the cookies option if you wish us to stop the cookies
                feature. Please note that if you deactivate cookies, you may not be able to access
                all or part of the Site, or to use all or part of the functionality through the
                Site.
              </li>
              <li>
                <b>Marketing and Communications</b> Data includes your preferences in receiving
                marketing from us and our third parties and your communication preferences.
              </li>
            </ul>
          </ul>
          <p className={`${style.paragraph}`}>
            If we are unable to collect your Personal Data, we may not be able to provide our
            services to you.
          </p>
          <p className={`${style.paragraph}`}>
            We also collect, use and share Aggregated Data such as statistical or demographic data
            for any purpose. Aggregated Data could be derived from your personal data but is not
            considered personal data in law as this data will not directly or indirectly reveal your
            identity.
          </p>
          <p className={`${style.paragraph}`}>
            We do not collect any Special Categories of Personal Data about you (this includes
            details about your race or ethnicity, religious or philosophical beliefs, sex life,
            sexual orientation, political opinions, trade union membership, information about your
            health, and genetic and biometric data). Nor do we collect any information about
            criminal convictions and offences.
          </p>
          <h2>
            <li>How We Use Your Personal Data</li>
          </h2>
          <p className={`${style.paragraph}`}>
            We may also collect, hold, use and disclose your Personal Data to offer you the best
            packages that will be suitable for your preferences. In addition, we may also collect,
            hold, use and disclose your Personal Data for the following purposes:
          </p>
          <ol>
            <li>registering your use of, and access to, the Site;</li>
            <li>managing, operating and administering the Site;</li>
            <li>
              contacting you regarding your use of, and access to, the Site and managing the queries
              and requests submitted by you through the Site;
            </li>
            <li>customizing your experience when using the Site;</li>
            <li>measuring and improving your customer experience and satisfaction;</li>
            <li>
              publishing your reviews about our services as well as the listed products on the Site;
            </li>
            <li>enforcing the provisions of the Myriad Terms of Use;</li>
            <li>resolving disputes, collecting outstanding payment and troubleshooting; and</li>
            <li>for any other purposes that we notify you of when we collect the Personal Data.</li>
          </ol>
          <p className={`${style.paragraph}`}>
            We may also collect, hold, use and disclose your Personal Data for:
          </p>
          <ol>
            <li>
              Digital marketing which includes, however is not limited to, tokenization, social
              media, display advertising, Search Engine Optimization (<b>&quot;SEO&quot;</b>),
              Search Engine Marketing (<b>&quot;SEM&quot;</b>) and push notification using open
              graph techniques;
            </li>
            <li>
              Conventional marketing purposes which includes, however is not limited to, sending you
              about new products, special offers, and surveys or other information which we think
              you may find interesting;
            </li>
            <li>
              Registering your use of, access to, and creation of an account/accounts to the
              site/application of our subsidiaries and/or affiliated companies; and
            </li>
            <li>
              Migration of your reviews on our Site to the to the site/application of our
              subsidiaries and/or affiliated companies.
            </li>
          </ol>
          <p className={`${style.paragraph}`}>
            We will only use your personal data for the purposes for which we collected it, unless
            we reasonably consider that we need to use it for another reason and that reason is
            compatible with the original purpose.
          </p>
          <p className={`${style.paragraph}`}>
            Please note that we may process your personal data without your knowledge or consent, in
            compliance with the above rules, where this is required or permitted by law.
          </p>
          <h2>
            <li>Sharing of Your Personal Data</li>
          </h2>
          <p className={`${style.paragraph}`}>
            Your Personal Data may be shared by us with other companies, organizations and
            individuals (each a <b>&quot;Third Party&quot;</b>) in connection with providing our
            services to you and to our other customers and for the other purposes set out in this
            Privacy Policy. The Third Parties we may provide your Personal Data to include, however
            are not limited to, providers of website hosting, content hosters, data analysis,
            marketing, promotions, and other relevant services. Your Personal Data may also be
            shared to our other subsidiaries and/or affiliated companies.
          </p>
          <p className={`${style.paragraph}`}>
            Myriad may also transfer your Personal Data to Third Parties located overseas. The
            countries in which these Third Parties may be located include the USA, Singapore, and
            countries to be determined by us from time to time. In any case, we will ensure that
            your Personal Data remains subject to a standard of protection comparable to the
            requirements under the laws of your country.
          </p>
          <p className={`${style.paragraph}`}>
            Please note that Myriad may disclose your Personal Data subject to the following
            conditions:
          </p>
          <ul>
            <li>
              <b>Consent and other legal basis</b>: We will only share your Personal Data with the
              Third Parties when we have your consent to do so or we have adopted appropriate legal
              basis of processing, such as necessary for the performance of a contract, a vital
              interest, a legal requirement, and/or legitimate interest subject to applicable laws
              and regulations. You agree that your use of our services will constitute your consent
              and that the sharing of your Personal Data will be subject to this Privacy Policy.
            </li>
            <li>
              <b>For Legal Reasons</b>: We may also, in our absolute discretion, share your Personal
              Data with Third Parties (including government agencies, law enforcement, and lawyers
              and other advisers) if we consider this is necessary to: i) comply with applicable
              laws and regulations; ii) investigate any potential fraud or illegal acts; or iii)
              protect our brand, our reputation and our property.
            </li>
          </ul>
          <h2>
            <li>Access to or Correction of Your Personal Data</li>
          </h2>
          <p className={`${style.paragraph}`}>
            When you provide us with your Personal Data, please ensure that it is accurate and
            complete. If you believe that any of your Personal Data held by us contains errors or
            omissions, please log into your account on the Site and correct the Personal Data. In
            addition, please update your Personal Data through your account in a timely manner,
            should there be any changes.
          </p>
          <p className={`${style.paragraph}`}>
            If you wish to correct an error or omission in any of your Personal Data held by us
            which cannot be corrected via your account on the Site, or to access your Personal Data
            held by us which cannot be accessed via your account on the Site, please submit your
            request to our contact details listed below.
          </p>
          <h2>
            <li>Withdrawing Consent</li>
          </h2>
          <p className={`${style.paragraph}`}>
            Where we have obtained your consent for any collecting, use or disclosure as indicated
            above, you may withdraw your consent to our collection, use or disclosure of your
            Personal Data, by giving us a reasonable notice. If you wish to withdraw your consent,
            please inform us at our contact details listed below. Upon your request, we will cease
            to collect, use or disclose your Personal Data, unless required by the laws or if we
            have legitimate business or legal purposes for collecting, using or disclosing such
            Personal Data. Note that by withdrawing your consent to our collection, use or
            disclosure of your Personal Data, we may not be able to continue providing you with some
            of our services and you agree that we will not be liable to you for any losses or
            damages arising out of or in relation to such termination of services.
          </p>
          <h2>
            <li>Removal of Your Personal Data and Your Legal Rights</li>
          </h2>
          <p className={`${style.paragraph}`}>
            To the extent permitted by applicable law, you may have the right to request us to
            remove your Personal Data that we hold from our systems, and you should inform us at our
            contact details listed below.
          </p>
          <p className={`${style.paragraph}`}>
            Upon your request, we will strive to remove your Personal Data from our systems, unless
            we are permitted or required by applicable laws to do otherwise. We will also cease to
            collect, use or disclose your Personal Data, unless otherwise permitted or required by
            applicable law Note that by requesting us to remove your Personal Data, we may not be
            able to continue providing you with our services.
          </p>
          <p className={`${style.paragraph}`}>
            Under certain circumstances, you have rights under data protection laws in relation to
            your personal data, such as, request to access, request correction, and object to
            processing. If you wish to exercise any of the rights set out above, please contact us.
          </p>
          <p className={`${style.paragraph}`}>
            You will not have to pay a fee to access your personal data (or to exercise any of the
            other rights). However, we may charge a reasonable fee if your request is clearly
            unfounded, repetitive or excessive. Alternatively, we could refuse to comply with your
            request in these circumstances
          </p>
          <h2>
            <li>Retention of Your Personal Data</li>
          </h2>
          <p className={`${style.paragraph}`}>
            Unless we remove your Personal Data from our systems following the receipt of a request
            from you, your Personal Data will be retained by us for as long as your account is in
            existence and as needed to provide you with our services. We shall cease to retain
            Personal Data, or will use reasonable efforts to remove the means by which the Personal
            Data can be associated with you as an individual, as soon as, 1) the purpose for which
            Personal Data was collected is no longer being served by the retention of that Personal
            Data; and 2) we are not otherwise permitted or required by applicable law to retain the
            Personal Data
          </p>
          <h2>
            <li>Protection of Your Personal Data</li>
          </h2>
          <p className={`${style.paragraph}`}>
            We will protect your Personal Data by maintaining reasonable security arrangements,
            including physical, technical and organizational procedures, to prevent unauthorized
            access, collection, use, disclosure, copying, modification, disposal or similar risks.
            If we are subject to a data breach that relates to your Personal Data, to the extent
            required by applicable law, we will notify you through our channels, whether directly or
            indirectly, to give you sufficient information regarding such data breach and will work
            to protect against the misuse of your Personal Data.
          </p>
          <h2>
            <li>Links to Other Websites</li>
          </h2>
          <p className={`${style.paragraph}`}>
            The Site may contain links to other websites. You should note that we do not have any
            control over such other websites. Please note that we are not responsible for the
            privacy policy or practices of such other websites and advise you to read the privacy
            policy of each website you visit which collects any of your Personal Data.
          </p>
          <h2>
            <li>Transfer or Cessation of Business</li>
          </h2>
          <p className={`${style.paragraph}`}>
            In the event of change of control or ownership of Myriad&apos;s business or group of
            companies (or a potential change of control or ownership), then your Personal Data may
            be disclosed and transferred as part of the transaction or potential transaction. In the
            event of cessation Myriad’s business, then your Personal Data will be erased permanently
            from our system.
          </p>
          <h2>
            <li>Complaints</li>
          </h2>
          <p className={`${style.paragraph}`}>
            If you have a complaint regarding the treatment of your Personal Data by us, please
            contact us at our contact details listed below. We will treat your complaint
            confidentially. We will contact you within a reasonable time after receipt of your
            complaint to discuss it and to outline options regarding how your complaint may be
            resolved. If you have a complaint regarding the treatment of your Personal Data that is
            not resolved by us, you may be able to make a complaint to the relevant regulatory
            authority.
          </p>
          <h2>
            <li>Our Contact Details</li>
          </h2>
          <p className={`${style.paragraph}`}>
            <b>
              If you have any questions or requests relating to this Privacy Policy, please contact
              our information officer at support@myriad.social
            </b>
          </p>
        </ol>
      </div>
    </Paper>
  );
};

export default PrivacyPolicy;

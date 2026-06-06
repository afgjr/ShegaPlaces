import React from 'react'

import Card from '../../share/components/UiComponents/Card'

import './PrivacyPolicy.css'

const PrivacyPolicy = () => {
  return (
    <Card className="privacy-policy">
      <h1>Privacy Policy</h1>
      <p>
        Shega Places is a platform that lets users share their favourite
        places.
      </p>

      <h2>What We Collect</h2>
      <p>
        If you sign in with Google, Shega Places collects only the basic
        information needed to create your account:
      </p>
      <ul>
        <li>Your name</li>
        <li>Your email address</li>
        <li>Your Google profile picture</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>
        We use this information only to identify your account, show your
        profile, and let you create and manage places you share in the app.
      </p>

      <h2>What We Do Not Do</h2>
      <p>
        Shega Places does not sell your personal information, share it with
        advertisers, or use it for advertising or marketing purposes.
      </p>

      <h2>Your Content</h2>
      <p>
        Places, descriptions, addresses, and images you add may be visible to
        other users of the app. You can edit or delete your own places at any
        time.
      </p>

      <h2>Data Storage</h2>
      <p>
        Your account information and shared places are stored so the app can
        work properly. If you want your account or data removed, you can contact
        the app owner.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about this privacy policy or want your data
        removed, please contact the Shega Places project owner.
      </p>

      <p className="privacy-policy__updated">Last updated: June 2026</p>
    </Card>
  )
}

export default PrivacyPolicy

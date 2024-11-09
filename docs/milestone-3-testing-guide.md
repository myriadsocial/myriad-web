# Testing Guide

To test the current additions in the third milestone, you need to access Myriad Social on the Paseo Network, where we are now live as a Parachain with ParaID 4005.

![Myriad Social Login](./select-wallet.png)

## Prerequisites

If you haven't used Myriad Social before, you'll need to:

1. Install Polkadot.js or Nova Wallet (for mobile users)
2. Generate a new seed-phrase for your Myriad Social Account
3. Connect to our RPC endpoint: `wss://ws-rpc.paseo.myriad.social`

## 1. Testing Polkadot Wallet Integration

The new wallet integration now features an enhanced user interface with interactive tooltips to guide you through the connection process.

### 1.1. Desktop Login Using Polkadot.js

1. Visit the Myriad Social login page
2. Look for interactive tooltips that will guide you through each step
3. Select "Connect with Polkadot Wallet"
4. Follow the simplified connection flow to complete authentication

![Select User](./select-user.png)
![Wallet Sign In](./wallet-sign-in.png)

### 1.2. Mobile Login Using Nova Wallet

1. Install Nova Wallet on your mobile device
2. Open Myriad Social in your mobile browser
3. Click on the wallet icon and select "Connect with Polkadot Wallet"
4. Follow the prompts in Nova Wallet to authorize the connection

## 2. Testing Timeline Features

### 2.1. Creating Regular Timeline

![Timeline Creation Step 1](./timeline-creation-1.png)
![Timeline Creation Step 2](./timeline-creation-2.png)
![Timeline Creation Step 3](./create-timeline-3.png)

1. Click the "Create New Timeline" button in the left sidebar
2. Fill in your timeline details:
   - Name (1-50 characters)
   - Description (up to 280 characters, optional)
   - Privacy settings
   - Timeline picture (optional)
3. Use the multi-staged interface to complete the setup

### 2.2. Creating Exclusive Timeline

![Create Exclusive Timeline](./create-exclusive-timeline.png)

1. Click "Create New Timeline"
2. Toggle the "Exclusive" switch to mark the timeline as exclusive
3. Complete the timeline details as above
4. The timeline will display an exclusive label when created

### 2.3. Timeline Discovery

![Timeline Discovery](./timeline-discovery.png)

Test the new discovery features:
1. Use the enhanced search capabilities
2. Filter timelines based on tags
3. Explore the "don't want to see" filtering options

## 3. Testing B2B Features

### 3.1. Account Sharing System

![Multi-User Management](./multi-user.png)

1. Generate a Personal Access Token (PAT):
   - Navigate to account settings
   - Generate a new token
   - Save the token immediately (it's shown only once)

### 3.2. Multi-User Management

Test the following features:
1. Timeline collaboration
2. Content metrics dashboard
3. Access level management
4. Team member permissions

## 4. Testing Enhanced Transaction Features

### 4.1. Tipping System

![Step Send Tip](./step-send-tip.png)
![Send Tip](./send-tip-myriar.png)

The new tipping interface offers:
1. Unified tipping window
2. Quick access buttons on posts
3. Transparent fee display
4. Multiple currency support

### 4.2. Exclusive Content

1. Create a new post
2. Click the "Add Exclusive Content" button
3. Set pricing in your preferred currency
4. Verify the exclusive content display

## 5. Testing Self-Hosting Capabilities

If testing the self-hosted version:

### 5.1. System Requirements
- Ubuntu 22.04 or later
- Minimum 4GB RAM
- 20GB available storage
- Sudo privileges
- Stable internet connection

### 5.2. Quick Setup
```bash
wget --no-cache https://raw.githubusercontent.com/myriadsocial/myriad-web/main/marauder.sh
chmod +x marauder.sh
./marauder.sh
```

### 5.3. Service Management
```bash
# Start service
sudo systemctl start myriad-social.service

# Check status
sudo systemctl status myriad-social.service

# View logs
sudo journalctl -u myriad-social.service
```

# Automated Tests

For automated testing of the new features, refer to our test environment setup:

```bash
docker run -it --name marauder-container \
--network host \
-v /var/run/docker.sock:/var/run/docker.sock \
agustinustheoo/marauder-test:latest
```

All features connect directly to the blockchain on the Paseo Network. For detailed API testing guidelines, refer to the Myriad Parachain repository.
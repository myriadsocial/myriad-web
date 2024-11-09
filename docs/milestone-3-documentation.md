# Documentation

Myriad Social is a Web3 Social Media platform that functions as a layer on top of regular social media. Initially built on top of Octopus Network, Myriad Social has now expanded to support multiple blockchain networks, including Octopus Network and NEAR blockchain.

In our latest milestone, we have introduced a refreshed user interface aimed at enhancing the overall user experience and simplifying platform interactions. This update brings streamlined functionalities, intuitive navigation, and comprehensive guides to assist both new and existing users.

## Myriad Social on Paseo Network

<div align="center">
<img src="https://raw.githubusercontent.com/agustinustheo/apps/1b55f22c955dd9f0077ba0fac962d8da5bfa9f64/packages/apps-config/src/ui/logos/nodes/myriadPaseo.svg" width="200">
</div>

We're excited to announce that Myriad Social is now part of the Paseo network as a Parachain with ParaID 4005! This integration brings new features and better connectivity to everyone using Myriad.

### Successful Data Migration

We've completed the token migration from Octopus Testnet to Myriad Paseo! All user funds have been safely moved through our automated airdrop process. This migration ensures that:
- All user balances are preserved
- Tokens are now active on Paseo Network
- No action is needed from users - funds are already transferred

For transparency, you can view:
- [Migration Script Source Code](https://github.com/myriadsocial/myriad-scripts/tree/main/scripts/paseo-airdrop)
- [Complete Airdrop Logs](https://github.com/myriadsocial/myriad-scripts/blob/main/scripts/paseo-airdrop/airdropLogs.txt)

### Quick Connection Guide

Need to connect? Use our RPC endpoint:
```
wss://ws-rpc.paseo.myriad.social
```

This endpoint lets you connect directly to Myriad Social on the Paseo network, making it easy to use all our features.

----

[Rest of the documentation continues with Section 1...]

----

## 1. Polkadot Setup, Connection, and User Guide

We have revamped the Polkadot wallet integration process to make it more user-friendly. A step-by-step guide with interactive tooltips now assists you through every stage of connecting your Polkadot wallet.

![Polkadot Setup Guide](./select-wallet.png)
![Polkadot Setup User Select Guide](./select-user.png)
![Sign the wallet](./wallet-sign-in.png)

The new Polkadot setup and connection process offers several enhancements. It includes **interactive tooltips** that provide real-time assistance when hovering over elements during the setup. Additionally, the **simplified connection flow** reduces the number of steps and offers clearer instructions, ensuring you can connect your wallet seamlessly. Furthermore, enhanced visuals with intuitive graphics guide you through the entire process, making the experience more user-friendly and visually appealing.

### Conclusion

These wallet improvements make it easier for everyone to use Web3 features. With clearer steps and helpful guides, connecting your wallet is now simpler and safer. 

## 2. Simplified Transaction Flow for Tipping and Exclusive Content

We have streamlined the transaction processes for tipping creators and accessing exclusive content, ensuring a smoother experience.

![Simplified Tipping Flow](./step-send-tip.png)
![Send Tip](./send-tip-myriar.png)

The new **Tipping Enhancements** bring a more seamless and transparent experience for users. With a **unified interface**, the tipping window is now consolidated and easy to navigate, simplifying the process. **Quick access buttons** allow users to tip creators directly from their posts without the need for extra navigation, making support instant and effortless. Moreover, **transparent fees** ensure that any transaction costs are clearly displayed before confirming a tip, fostering trust and clarity in every transaction.

## 3. Simplified Timeline Discovery and First Step Guide for New Users

![Timeline Discovery](./timeline-discovery.png)

Discovering new timelines and managing your own is now more intuitive thanks to a revamped layout and enhanced search capabilities, allowing users to discover new timeline based on tags user want to see or dont want to see.

![First Step Guide](./step-create-timeline.png)

The first step for user is to click the create timeline button that redirects user to our multi staged timeline creation interface designed to prevent information overload to user while still allowing user to have more granular control over their timeline.

![Step One](./timeline-creation-1.png)
![Step Two](./timeline-creation-2.png)
![Step Three](./create-timeline-3.png)

The new user onboarding guide includes Step-by-Step Tooltips, which provide contextual tips as you navigate through the platform, and an Onboarding Checklist that allows you to keep track of your progress with a list of introductory tasks. These features work together to ensure a smooth and comprehensive onboarding experience, helping you become familiar with the platform efficiently and effectively.

### Exclusive Timeline

![Exclusive Timelines](./create-exclusive-timeline.png)

We have introduced the Exclusive Timeline feature, which allows you to mark specific timeline content as exclusive. Here's how to create one:

1. Click the "Create New Timeline" button in the left sidebar to start creating a new timeline

2. In the creation form, you'll find an "Exclusive" toggle switch that lets you mark your timeline as exclusive content

3. After filling in your timeline details, click the "Next" button to proceed with creating your exclusive timeline

Your timeline name can be between 1-50 characters, and you can optionally add a description (up to 280 characters). You can also set the privacy level (Public, Private, etc.) and customize the timeline picture.

When a timeline is marked as exclusive, it will be clearly indicated with an exclusive label, helping differentiate it from regular timelines in the listing.

## 4. B2B Features: Multi-User Management System

We have implemented comprehensive B2B features that enable organizations to manage multiple users, timelines, and content metrics efficiently through a single interface. This enterprise-grade functionality provides organizations with powerful tools for team collaboration and content management.

![Multi-User Token](./multi-user.png)

### Account Sharing System

The new account sharing system introduces a secure way to manage multiple user access:

- **Personal Access Tokens (PAT)**: Generate secure tokens for controlled account access
- **One-Time Token Display**: Enhanced security with tokens shown only once during generation
- **Seamless Authentication**: Quick login process using generated tokens

### Multi-User Capabilities

Our B2B implementation offers essential features for team management, including timeline collaboration for shared contributions, a content metrics dashboard to track engagement and performance, and access level management to control user permissions. Designed with a focus on security and usability, this multi-user system empowers businesses and organizations to strengthen their social media presence while maintaining control over their digital assets.

### Video Tutorial: Multi-User System

[![Multi-User Tutorial](https://img.youtube.com/vi/-cf-RXFiCdM/0.jpg)](https://www.youtube.com/watch?v=-cf-RXFiCdM)

### Conclusion

With these new B2B features, teams and businesses can now better manage their Myriad Social presence. Whether you're handling multiple accounts, working with a team, or tracking content performance, these tools make it simple.

## 5. Mobile Wallet Integration with Nova Wallet

We are excited to announce that Myriad Social now supports mobile wallet integration with Nova Wallet. Previously, mobile users were limited to connecting via NEAR Wallet, but with this update, you can now connect your Polkadot wallet seamlessly on mobile devices.

### Video Tutorial: Nova Wallet Integration
[![Nova Wallet Tutorial](https://img.youtube.com/vi/6PtEhR9-K50/0.jpg)](https://www.youtube.com/watch?v=6PtEhR9-K50)

The mobile wallet integration with Nova Wallet offers the following benefits:

- **Polkadot Wallet Support on Mobile**: Easily connect your Polkadot wallet using Nova Wallet on your mobile device.
- **Streamlined Authentication**: Enjoy a seamless login experience with enhanced security.
- **Cross-Platform Compatibility**: Access your account across multiple devices without any hassles.

### Getting Started with Nova Wallet Integration

To connect your Polkadot wallet on mobile, follow these steps:

1. **Download Nova Wallet**: Ensure you have the Nova Wallet app installed on your mobile device.
2. **Navigate to Myriad Social**: Open Myriad Social on your mobile browser.
3. **Connect Wallet**: Click on the wallet icon and select "Connect with Polkadot Wallet".
4. **Authorize Connection**: Follow the prompts in Nova Wallet to authorize the connection.
5. **Start Exploring**: Once connected, you can start interacting with the Myriad Social platform.

## 6. Backend Improvements and Algorithm Enhancements

![Refined Content](./Filtering%20cut%20off12.png)

We have significantly enhanced our backend infrastructure and algorithms to improve content discovery, platform performance, and user experience. Users can now seamlessly import and embed [YouTube content](https://github.com/myriadsocial/myriad-api/pull/976) with native playback support, automatic metadata extraction, and optimized performance, while our refined content ranking algorithm focuses on the most recent 12 months of data to ensure fresh content, phasing out historical posts while still maintaining archive access. Enhanced ranking factors now include post engagement metrics, timeline trends, hashtag usage, user interactions, and content quality signals.

### Video Tutorial: Update Filtering

## [![Filteringl](https://img.youtube.com/vi/D0Km7_Buclo/0.jpg)](https://www.youtube.com/watch?v=D0Km7_Buclo)

## 7. Performance Optimization and Enhancement

We have implemented significant performance improvements to enhance the user experience and reduce resource consumption. These optimizations focus on reducing payload sizes, implementing modern compression techniques, and optimizing network requests.

### Reduced Transfer Size

We have successfully cut the total transfer size by more than 50%, reducing it from 24.3 MB to 10.4 MB. This dramatic reduction results in faster page loads and reduced data consumption for users.

#### Transfer Size Before
![Transfer Size Before](image.png)

#### Transfer Size After
![Transfer Size After](image-1.png)

### Brotli Compression Implementation

The platform now utilizes Brotli compression, a modern compression algorithm that offers better compression ratios compared to traditional methods like gzip. This enhancement enables:
- Smaller file sizes for faster downloads
- Reduced server bandwidth usage
- The significant improvements in our JavaScript bundle size (14% reduction to 325kb)
- The enhanced Fetch/XHR payload efficiency (reduced to 7%)

![Brotli Compression](image-2.png)

### Optimized API Communications

We've achieved a significant improvement in Fetch/XHR payload efficiency through Brotli compression, reducing the overhead to just 7% of its previous size. This optimization results in:
- Faster API responses
- Reduced server load
- More efficient data transfer

#### API Payload Before
![API Payload Before](image-3.png)

#### API Payload After
![API Payload After](image-5.png)

### JavaScript Bundle Optimization

Through careful analysis and optimization of our JavaScript bundles, combined with Brotli compression, we've achieved a 14% reduction in JavaScript payload size, bringing it down to 325kb. This improvement provides:
- Faster initial page loads
- Reduced memory usage
- Improved runtime performance
- Better mobile device performance

#### JS Bundle Size Before
![JS Bundle Size Before](image-6.png)

#### JS Bundle Size After
![JS Bundle Size After](image-4.png)

These performance improvements collectively contribute to a more responsive and efficient platform, particularly benefiting users on mobile devices or with limited bandwidth. Users can now enjoy:
- Faster page loading times
- Reduced data usage
- Smoother interactions
- Improved overall experience

### Conclusion

Our latest updates have made Myriad Social faster and more efficient. Pages load quicker, use less data, and work better on all devices. Using new compression technology and better code, we've cut loading times in half while using less bandwidth.

## 8. Self-Hosting Capabilities

We are excited to announce that Myriad Social can now be self-hosted, giving users complete control over their social media infrastructure. Our comprehensive setup process utilizes industry-standard technologies to ensure reliable deployment and maintenance.

### Getting Started

Detailed documentation and resources are available to help you begin your self-hosting journey:

1. Review our [Complete Setup Guide](https://github.com/myriadsocial/myriad-infrastructure/blob/main/linux/README.md)
2. Download the [Marauder Setup Script](https://github.com/myriadsocial/myriad-infrastructure/blob/main/linux/marauder.sh)
3. Check our [Test Environment Dockerfile](https://github.com/myriadsocial/myriad-infrastructure/blob/main/linux/Dockerfile)

Our self-hosting solution empowers users to:
- Maintain complete control over their data
- Customize their instance configuration
- Scale resources according to needs
- Implement custom security policies
- Access detailed system metrics
- Perform direct database management

### System Requirements

To successfully self-host Myriad Social, your system should meet the following requirements:

- Ubuntu 22.04 or later
- Sudo privileges
- Stable internet connection
- Minimum 4GB RAM
- 20GB available storage
- Basic command-line knowledge

### Core Infrastructure Components

The self-hosted version of Myriad Social is built on a robust stack of modern technologies:

- **Docker & Docker Compose**: Container orchestration for consistent deployment
- **MongoDB**: Database management for user data and content
- **MinIO**: Object storage for media and files
- **Nginx**: Web server and reverse proxy
- **zrok**: Secure tunnel for public access
- **Systemd**: Service management and monitoring

![Infrastructure Overview](image-7.png)

### Automated Setup Process

We've developed the Marauder setup script to streamline the installation process. This automated tool handles:

- System dependency installation
- Docker environment configuration
- Database setup and initialization
- Storage system deployment
- Service configuration
- Network tunnel establishment

```bash
# Quick start command
wget --no-cache https://raw.githubusercontent.com/myriadsocial/myriad-infrastructure/main/linux/marauder.sh
chmod +x marauder.sh
./marauder.sh
```

![Marauder Setup Flow](image-8.png)

### Docker Container Management

The platform utilizes Docker containers for easy deployment and management. Users can control their instance using standard Docker commands or our service wrapper:

```bash
# Start Myriad Social service
sudo systemctl start myriad-social.service

# Monitor service status
sudo systemctl status myriad-social.service

# View service logs
sudo journalctl -u myriad-social.service
```

### Development Environment

For developers and testers, we provide a specialized Docker container that simulates the production environment:

```bash
docker run -it --name marauder-container \
--network host \
-v /var/run/docker.sock:/var/run/docker.sock \
agustinustheoo/marauder-test:latest
```

---

We are excited for you to experience these new features and improvements. Your feedback is invaluable to us, so please do not hesitate to share your thoughts and suggestions.

**Host your own decentralized social network!**

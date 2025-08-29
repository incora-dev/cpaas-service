import { InfobipProvider, InfobipConfig } from './providers/InfobipProvider';
import { ProviderFactory, ProviderConfig } from './providers/ProviderFactory';
// import { CarouselMessage, ImageMessage, TextMessage, VideoMessage, FileMessage, ListMessage } from './types/message-types';
import { TextMessage, AudioMessage } from './types/message-types';

main();

async function main() {
  const infobipConfig: InfobipConfig = {
    baseUrl: process.env['INFOBIP_BASE_URL'] || 'https://wgqd1r.api.infobip.com',
    apiKey: process.env['INFOBIP_API_KEY'] || '2c971f613559b46363608c0ea093c7af-5af273da-7ce7-45fd-9c2e-9e17cdc13003'
  };
  
  const infobipProvider = new InfobipProvider(infobipConfig);
  
  try {
    // await infobipProvider.send('viber', { type: 'text', text: 'Hello from Infobip Viber' } as TextMessage, '380976115062');
    // await infobipProvider.send('sms', { type: 'text', text: 'Hello from Infobip SMS' } as TextMessage, '380976115062');
    // await infobipProvider.send('whatsapp', { type: 'text', text: 'Hello from Infobip WhatsApp' } as TextMessage, '380976115062');
    // await infobipProvider.send('viber', { type: 'image', mediaUrl: 'https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg', caption: 'Nice cats' } as ImageMessage, '380976115062');
    // await infobipProvider.send('whatsapp', { type: 'image', mediaUrl: 'https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg', caption: 'Nice cats' } as ImageMessage, '380976115062');
  //   await infobipProvider.send('viber', { type: 'carousel', items: [{
  //     "title": "Cat 1",
  //     "description": "Beautiful cat 1",
  //     "mediaUrl": "https://images.unsplash.com/photo-1578680632090-5933d7784c7b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     "buttons": [
  //         {"title": "Like", "action": "https://images.unsplash.com/photo-1578680632090-5933d7784c7b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
  //         {"title": "Share", "action": "https://images.unsplash.com/photo-1578680632090-5933d7784c7b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
  //     ]
  // },
  // {
  //     "title": "Cat 2",
  //     "description": "Beautiful cat 2",
  //     "mediaUrl": "https://images.unsplash.com/photo-1558011958-c3bc18a2e393?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     "buttons": [
  //         {"title": "Like", "action": "https://images.unsplash.com/photo-1558011958-c3bc18a2e393?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
  //         {"title": "Share", "action": "https://images.unsplash.com/photo-1558011958-c3bc18a2e393?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
  //     ]
  // },
  // {
  //     "title": "Cat 3",
  //     "description": "Beautiful cat 3",
  //     "mediaUrl": "https://images.unsplash.com/photo-1716467891152-1b43a96de578?q=80&w=2081&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     "buttons": [
  //         {"title": "Like", "action": "https://images.unsplash.com/photo-1716467891152-1b43a96de578?q=80&w=2081&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
  //         {"title": "Share", "action": "https://images.unsplash.com/photo-1716467891152-1b43a96de578?q=80&w=2081&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
  //     ]
  // }] } as CarouselMessage, '380976115062');
    // await infobipProvider.send('whatsapp', {
    //   type: 'video',
    //   mediaUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    //   caption: 'Hello WhatsApp!'
    // } as VideoMessage, '380976115062');
    // await infobipProvider.send('viber', {
    //   type: 'video',
    //   mediaUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    //   caption: 'Hello Viber!',
    //   thumbnailUrl: 'https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg',
    //   duration: 'PT30S'
    // } as VideoMessage, '380976115062');
    // await infobipProvider.send('whatsapp', {
    //   type: 'file',
    //   mediaUrl: 'https://raw.githubusercontent.com/cyb70289/utf8/master/UTF-8-demo.txt',
    // } as FileMessage, '380976115062');
    // await infobipProvider.send('viber', {
    //   type: 'file',
    //   mediaUrl: 'https://raw.githubusercontent.com/cyb70289/utf8/master/UTF-8-demo.txt',
    //   fileName: 'test.txt',
    // } as FileMessage, '380976115062');
    // await infobipProvider.send('viber', { type: 'list', text: 'Choose one:', options: ['Option 1', 'Option 2', 'Option 3'], } as ListMessage, '380976115062');
    // await infobipProvider.send(
    //   "whatsapp",
    //   {
    //     type: "list",
    //     text: "Choose one:",
    //     actionTitle: "Pick option",
    //     sections: [
    //       {
    //         title: "Available options",
    //         rows: [
    //           { id: "1", title: "Option 1" },
    //           { id: "2", title: "Option 2" },
    //           { id: "3", title: "Option 3" },
    //         ],
    //       },
    //     ],
    //     messageId: "123e4567-e89b-12d3-a456-426614174000",
    //   } as ListMessage,
    //   "380976115062"
    // );
    await infobipProvider.send(
      "whatsapp",
      {
        type: "audio",
        mediaUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        messageId: "123e4567-e89b-12d3-a456-426614174000",
      } as AudioMessage,
      "380976115062"
    );



    console.log('Provider-specific channel messages sent successfully!');
  } catch (error) {
    console.error('Error with provider-specific channels:', error);
  }

  const providerConfig: ProviderConfig = {
    infobip: infobipConfig
  };
  
  const infobipProviderFromFactory = ProviderFactory.createProvider('infobip', providerConfig);
  
  try {
    await infobipProviderFromFactory.send('viber', { type: 'text', text: 'Hello from Factory Infobip' } as TextMessage, '380976115062');
    console.log('Factory provider messages sent successfully!');
  } catch (error) {
    console.error('Error with factory provider:', error);
  }
}

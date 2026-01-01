import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

class SoundService {
  constructor() {
    this.sounds = {};
  }

  async playSound(name) {
    // Trigger Haptics first for immediate feedback
    if (name === 'heavy') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else if (name === 'light') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (name === 'success') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await Haptics.selectionAsync();
    }

    // Try to play sound (optional, might fail if offline/url bad)
    try {
        // We can add actual sound files here if available in assets
        // For now, we rely on Haptics which provides excellent "tactile audio"
    } catch (error) {
      console.log('Sound error', error);
    }
  }
}

export default new SoundService();

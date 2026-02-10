import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { AnimatedPressable } from '../components';

/** Three bouncing dots for a polished "thinking" indicator */
function TypingDots() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
      );
    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 150);
    const a3 = animate(dot3, 300);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [dot1, dot2, dot3]);

  return (
    <View style={typingStyles.row}>
      {[dot1, dot2, dot3].map((d, i) => (
        <Animated.View
          key={i}
          style={[typingStyles.dot, { transform: [{ translateY: d }] }]}
        />
      ))}
    </View>
  );
}

const typingStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 8, paddingHorizontal: 4 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.midGray },
});

interface Message {
  id: string;
  type: 'agent' | 'user' | 'suggestion';
  text: string;
  timestamp: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    type: 'agent',
    text: "Good morning! I notice you're near Fern Valley — there's a quieter trail entrance on the north side that most people miss. Perfect conditions right now.",
    timestamp: '9:12 AM',
    icon: 'sunny-outline',
  },
  {
    id: '2',
    type: 'suggestion',
    text: 'Take the North Entrance',
    timestamp: '',
    icon: 'trail-sign-outline',
  },
  {
    id: '3',
    type: 'suggestion',
    text: 'Show me the map',
    timestamp: '',
    icon: 'map-outline',
  },
  {
    id: '4',
    type: 'user',
    text: "That sounds great! What's the trail like?",
    timestamp: '9:14 AM',
  },
  {
    id: '5',
    type: 'agent',
    text: "The Fern Valley North loop is 3.2 km with gentle elevation. You'll pass through old-growth cedar, a small creek crossing, and there's a viewpoint at the halfway mark that catches morning light beautifully. \n\nI'd suggest bringing water — the nearest cafe is 1.8 km from the trailhead. I can guide you there after if you'd like.",
    timestamp: '9:14 AM',
    icon: 'leaf-outline',
  },
  {
    id: '6',
    type: 'agent',
    text: "Also — I spotted that golden hour at Sunset Point will be at 6:47 PM today. That's about a 20-minute drive from here. Want me to save a reminder?",
    timestamp: '9:15 AM',
    icon: 'time-outline',
  },
];

const QUICK_ACTIONS = [
  { id: '1', label: 'Nearby trails', icon: 'trail-sign-outline' as const },
  { id: '2', label: 'Find a cafe', icon: 'cafe-outline' as const },
  { id: '3', label: 'Wildlife nearby', icon: 'paw-outline' as const },
  { id: '4', label: 'Quiet spots', icon: 'leaf-outline' as const },
];

interface AgentResponse {
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  suggestions?: string[];
}

function getAgentResponse(userText: string): AgentResponse {
  const lower = userText.toLowerCase();

  if (lower.includes('trail') || lower.includes('hike') || lower.includes('walk')) {
    return {
      text: "I found 3 trails near you right now:\n\n1. Misty Ridge Trail — 1.2 km, gentle elevation, low crowd density. Great for a peaceful walk.\n2. Cedar Loop — 2.8 km, moderate, just opened last week. Stunning old-growth forest.\n3. Fern Valley North — 3.2 km, easy, the one I mentioned earlier.\n\nMisty Ridge has the fewest people right now. Want me to guide you there?",
      icon: 'trail-sign-outline',
      suggestions: ['Guide me to Misty Ridge', 'Tell me more about Cedar Loop'],
    };
  }

  if (lower.includes('cafe') || lower.includes('coffee') || lower.includes('eat') || lower.includes('food') || lower.includes('restaurant')) {
    return {
      text: "There's a hidden gem 0.5 km from you — The Mossy Stone Cafe. Locally roasted coffee, outdoor seating overlooking a small creek. Open until 5 PM.\n\nIf you're looking for something after your hike, the Trailhead Kitchen is 1.8 km away with great sandwiches and a warm fireplace. Both have strong reviews from other explorers.",
      icon: 'cafe-outline',
      suggestions: ['Directions to Mossy Stone', 'What else is nearby?'],
    };
  }

  if (lower.includes('wildlife') || lower.includes('animal') || lower.includes('bird') || lower.includes('eagle')) {
    return {
      text: "Active wildlife sightings near you:\n\n- Eagle Nesting Grounds (3.4 km) — Multiple bald eagle sightings this morning. Best viewed from the south overlook.\n- Deer are frequently spotted along Fern Valley North in the early morning.\n- A family of otters has been seen at Cedar Creek crossing.\n\nEagle Nesting Grounds earns 300 WANDR Points — the highest nearby. Keep quiet and bring binoculars!",
      icon: 'paw-outline',
      suggestions: ['Guide me to Eagle Nesting', 'What wildlife is active now?'],
    };
  }

  if (lower.includes('quiet') || lower.includes('peaceful') || lower.includes('calm') || lower.includes('alone')) {
    return {
      text: "Looking for some solitude? Here's what I'd recommend right now:\n\n- Fern Valley North entrance — only 2 people passed in the last hour. The creek area is completely empty.\n- The overlook at Misty Ridge — the crowds usually head to Sunset Point instead.\n\nBased on patterns, the quietest time today will be between 2-4 PM. I can ping you when crowd density drops even further.",
      icon: 'leaf-outline',
      suggestions: ['Remind me at 2 PM', 'Find more quiet spots'],
    };
  }

  if (lower.includes('sunset') || lower.includes('golden hour') || lower.includes('sunrise') || lower.includes('photo')) {
    return {
      text: "Golden hour at Sunset Point is at 6:47 PM today — about 20 minutes away. The western ridge will have the best light.\n\nFor sunrise tomorrow, Eagle Ridge faces east and catches first light at 6:12 AM. Both spots earn bonus WANDR Points during golden hour.\n\nI'll save a reminder 30 minutes before if you'd like to catch it.",
      icon: 'sunny-outline',
      suggestions: ['Set a sunset reminder', 'Best photo spots nearby'],
    };
  }

  if (lower.includes('point') || lower.includes('reward') || lower.includes('wandr') || lower.includes('afk') || lower.includes('earn')) {
    return {
      text: "Here's how to maximize your WANDR Points today:\n\n- Complete Fern Valley North loop: +120 points\n- Visit Eagle Nesting Grounds: +300 points\n- Capture a verified moment at Sunset Point: +200 points\n- Share an adventure to the feed: +50 points\n\nYou're 1,550 points from Explorer tier. A full day exploring could get you there!",
      icon: 'trophy-outline',
      suggestions: ['Plan my route for max points', 'How does $AFK work?'],
    };
  }

  if (lower.includes('map') || lower.includes('direction') || lower.includes('guide') || lower.includes('route') || lower.includes('navigate')) {
    return {
      text: "I can guide you to any nearby spot. Here's what's closest:\n\n- The Mossy Stone Cafe — 0.5 km, ~6 min walk\n- Misty Ridge Trail — 1.2 km, ~15 min walk\n- Sunset Point Overlook — 2.8 km, ~35 min walk\n\nI'll track your route and verify your steps for WANDR Points along the way. Where would you like to go?",
      icon: 'map-outline',
      suggestions: ['Guide me to the nearest spot', 'Show all nearby spots'],
    };
  }

  if (lower.includes('weather') || lower.includes('temperature') || lower.includes('rain') || lower.includes('conditions')) {
    return {
      text: "Current conditions in Fern Valley:\n\n- 18°C, clear skies, light breeze from the west\n- UV index: moderate (sunscreen recommended after noon)\n- No rain expected until Thursday\n- Trail conditions: dry, all paths clear\n\nPerfect conditions for outdoor exploration today.",
      icon: 'cloud-outline',
      suggestions: ['Best time to hike today?', 'Weekly forecast'],
    };
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('morning') || lower.includes('afternoon')) {
    return {
      text: "Hey there! Great to see you exploring today. Conditions are perfect — 18°C, clear skies, and the trails are quiet.\n\nAnything specific you're looking for? I can find trails, cafes, wildlife spots, or suggest the best route to maximize your WANDR Points today.",
      icon: 'hand-left-outline',
    };
  }

  if (lower.includes('help') || lower.includes('what can you do') || lower.includes('how do')) {
    return {
      text: "I'm your quiet sixth sense for the real world. Here's what I can help with:\n\n- Find trails, cafes, and hidden gems nearby\n- Suggest quieter routes with fewer crowds\n- Track wildlife sightings in your area\n- Optimize your route for WANDR Points\n- Alert you to golden hour and special conditions\n\nJust ask naturally — I'm always monitoring nearby conditions in the background.",
      icon: 'sparkles-outline',
    };
  }

  // Default contextual fallback
  const fallbacks: AgentResponse[] = [
    {
      text: "Interesting question! Based on your current location near Fern Valley, I'd suggest heading to the North loop trailhead — it's the best-kept secret around here. Only a 10-minute walk from where you are.\n\nWant me to look into anything specific? I can check trails, cafes, wildlife, or weather conditions.",
      icon: 'compass-outline',
      suggestions: ['What trails are nearby?', 'Find something unique'],
    },
    {
      text: "Let me think about that... While I work on it, here's something you might enjoy: the Mossy Stone Cafe is just 0.5 km away and gets great reviews from other explorers. The outdoor patio overlooks a creek — perfect for a break.\n\nI can also check trails, weather, or wildlife in your area. What sounds good?",
      icon: 'sparkles-outline',
      suggestions: ['Nearby trails', 'Find a cafe'],
    },
    {
      text: "I'm always scanning for the best experiences near you. Right now, crowd density is low on most trails and the weather is ideal for exploration.\n\nYou're 1,550 WANDR Points from the next tier. A good loop through Misty Ridge and Sunset Point could earn you 320+ points today. Want me to plan a route?",
      icon: 'analytics-outline',
      suggestions: ['Plan a route', 'What can I earn today?'],
    },
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export function AgentScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = (text?: string) => {
    const messageText = (text || inputText).trim();
    if (!messageText) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      const response = getAgentResponse(messageText);
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        icon: response.icon,
      };

      const newMessages: Message[] = [agentMsg];

      if (response.suggestions) {
        response.suggestions.forEach((suggestion, i) => {
          newMessages.push({
            id: (Date.now() + 2 + i).toString(),
            type: 'suggestion',
            text: suggestion,
            timestamp: '',
            icon: 'arrow-forward-outline',
          });
        });
      }

      setMessages((prev) => [...prev, ...newMessages]);
      setIsTyping(false);
    }, delay);
  };

  const renderMessage = (msg: Message) => {
    if (msg.type === 'suggestion') {
      return (
        <AnimatedPressable
          key={msg.id}
          style={styles.suggestionBubble}
          onPress={() => sendMessage(msg.text)}
          activeScale={0.96}
          haptic="selection"
        >
          {msg.icon && <Ionicons name={msg.icon} size={16} color={Colors.primary} />}
          <Text style={styles.suggestionText}>{msg.text}</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.primaryLight} />
        </AnimatedPressable>
      );
    }

    if (msg.type === 'user') {
      return (
        <View key={msg.id} style={styles.userBubbleContainer}>
          <View style={styles.userBubble}>
            <Text style={styles.userText}>{msg.text}</Text>
          </View>
          <Text style={styles.timestamp}>{msg.timestamp}</Text>
        </View>
      );
    }

    return (
      <View key={msg.id} style={styles.agentBubbleContainer}>
        <View style={styles.agentRow}>
          <View style={styles.agentAvatar}>
            <Ionicons name="sparkles" size={16} color={Colors.accentLight} />
          </View>
          <View style={styles.agentBubble}>
            {msg.icon && (
              <View style={styles.agentContextIcon}>
                <Ionicons name={msg.icon} size={14} color={Colors.primaryLight} />
              </View>
            )}
            <Text style={styles.agentText}>{msg.text}</Text>
          </View>
        </View>
        <Text style={[styles.timestamp, { marginLeft: 44 }]}>{msg.timestamp}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={Colors.gradientForest} style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
        <View style={styles.headerContent}>
          <View style={styles.agentHeaderIcon}>
            <Ionicons name="sparkles" size={24} color={Colors.accentLight} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>WandrLust Agent</Text>
            <Text style={styles.headerSubtitle}>Your quiet sixth sense</Text>
          </View>
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="settings-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Status */}
        <View style={styles.statusBar}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Active · Monitoring nearby conditions</Text>
        </View>
      </LinearGradient>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Context card */}
          <View style={styles.contextCard}>
            <Ionicons name="location" size={16} color={Colors.primary} />
            <Text style={styles.contextText}>
              Fern Valley Area · 18°C · Clear skies · Low crowd density
            </Text>
          </View>

          {messages.map(renderMessage)}

          {isTyping && (
            <View style={styles.agentBubbleContainer}>
              <View style={styles.agentRow}>
                <View style={styles.agentAvatar}>
                  <Ionicons name="sparkles" size={16} color={Colors.accentLight} />
                </View>
                <View style={styles.agentBubble}>
                  <TypingDots />
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Quick actions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContent}
          style={styles.quickActions}
        >
          {QUICK_ACTIONS.map((action) => (
            <AnimatedPressable
              key={action.id}
              style={styles.quickActionChip}
              onPress={() => sendMessage(action.label)}
              activeScale={0.95}
              haptic="selection"
            >
              <Ionicons name={action.icon} size={14} color={Colors.primary} />
              <Text style={styles.quickActionText}>{action.label}</Text>
            </AnimatedPressable>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask your Agent anything..."
            placeholderTextColor={Colors.midGray}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            onSubmitEditing={() => sendMessage()}
          />
          <AnimatedPressable
            style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim()}
            activeScale={0.85}
            haptic="none"
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={inputText.trim() ? Colors.white : Colors.midGray}
            />
          </AnimatedPressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  header: {
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentHeaderIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.white,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.6)',
  },
  headerAction: {
    padding: Spacing.sm,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingLeft: 60,
    gap: Spacing.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  statusText: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.5)',
  },
  chatArea: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.md,
  },
  contextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '08',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary + '12',
  },
  contextText: {
    ...Typography.caption,
    color: Colors.stone,
    flex: 1,
  },
  agentBubbleContainer: {
    marginBottom: Spacing.md,
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  agentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  agentBubble: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderTopLeftRadius: BorderRadius.sm,
    padding: Spacing.md,
    maxWidth: '82%',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  agentContextIcon: {
    marginBottom: Spacing.xs,
  },
  agentText: {
    ...Typography.body,
    color: Colors.charcoal,
    fontSize: 15,
  },
  typingText: {
    ...Typography.body,
    color: Colors.midGray,
    fontSize: 15,
    fontStyle: 'italic',
  },
  userBubbleContainer: {
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.sm,
    padding: Spacing.md,
    maxWidth: '80%',
  },
  userText: {
    ...Typography.body,
    color: Colors.white,
    fontSize: 15,
  },
  timestamp: {
    ...Typography.caption,
    color: Colors.midGray,
    marginTop: 4,
    fontSize: 11,
  },
  suggestionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '08',
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
    marginLeft: 44,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  suggestionText: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: '600',
  },
  quickActions: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  quickActionsContent: {
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  quickActionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '08',
    borderRadius: BorderRadius.full,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.primary + '15',
  },
  quickActionText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    ...Typography.body,
    color: Colors.charcoal,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
});

import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

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

export function AgentScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulated agent response
    setTimeout(() => {
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        text: "Let me look into that for you. Based on your location and preferences, I have a few suggestions that should work well. Give me a moment to find the best options nearby.",
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        icon: 'sparkles-outline',
      };
      setMessages((prev) => [...prev, agentMsg]);
    }, 1200);
  };

  const renderMessage = (msg: Message) => {
    if (msg.type === 'suggestion') {
      return (
        <TouchableOpacity
          key={msg.id}
          style={styles.suggestionBubble}
          onPress={() => {
            setInputText(msg.text);
          }}
        >
          {msg.icon && <Ionicons name={msg.icon} size={16} color={Colors.primary} />}
          <Text style={styles.suggestionText}>{msg.text}</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.primaryLight} />
        </TouchableOpacity>
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
      <LinearGradient colors={Colors.gradientForest} style={styles.header}>
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
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionChip}
              onPress={() => setInputText(action.label)}
            >
              <Ionicons name={action.icon} size={14} color={Colors.primary} />
              <Text style={styles.quickActionText}>{action.label}</Text>
            </TouchableOpacity>
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
          />
          <TouchableOpacity
            style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={inputText.trim() ? Colors.white : Colors.midGray}
            />
          </TouchableOpacity>
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
    paddingTop: 60,
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

# ActionPopup Component Usage Examples

## Basic Usage

```tsx
import ActionPopup from '@/components/chatui/components/ActionPopup';

// In your component:
const [showPopup, setShowPopup] = useState(false);

<ActionPopup
  isOpen={showPopup}
  title="Okay lets start with avatar!"
  onClose={() => setShowPopup(false)}
  onPrimaryAction={() => console.log('Primary clicked')}
  onSecondaryAction={() => console.log('Secondary clicked')}
  onTertiaryAction={() => console.log('Tertiary clicked')}
  primaryLabel="upload ur owns"
  secondaryLabel="generate"
  tertiaryLabel="proceed"
  showTertiary={true}
/>
```

## Two Buttons Only (No Tertiary)

```tsx
<ActionPopup
  isOpen={showPopup}
  title="Choose your option"
  onClose={() => setShowPopup(false)}
  onPrimaryAction={handleOption1}
  onSecondaryAction={handleOption2}
  primaryLabel="Option 1"
  secondaryLabel="Option 2"
  showTertiary={false}  // Hide the third button
/>
```

## With Custom Actions

```tsx
const handleUpload = () => {
  // Open file picker
  setShowPopup(false);
};

const handleGenerate = () => {
  // Navigate to generation page
  router.push('/generate');
  setShowPopup(false);
};

const handleProceed = () => {
  // Continue with existing avatar
  setChatState('active');
  setShowPopup(false);
};

<ActionPopup
  isOpen={showAvatarPopup}
  title="Okay lets start with avatar!"
  onClose={() => setShowAvatarPopup(false)}
  onPrimaryAction={handleUpload}
  onSecondaryAction={handleGenerate}
  onTertiaryAction={handleProceed}
/>
```

## Different Use Cases

### 1. Avatar Selection
```tsx
<ActionPopup
  isOpen={true}
  title="Okay lets start with avatar!"
  primaryLabel="upload ur owns"
  secondaryLabel="generate"
  tertiaryLabel="proceed"
/>
```

### 2. Pose Selection
```tsx
<ActionPopup
  isOpen={true}
  title="How about the pose?"
  primaryLabel="choose from library"
  secondaryLabel="generate new"
  tertiaryLabel="skip"
/>
```

### 3. Style Selection
```tsx
<ActionPopup
  isOpen={true}
  title="Pick your style!"
  primaryLabel="casual"
  secondaryLabel="formal"
  tertiaryLabel="creative"
/>
```

### 4. Confirmation Dialog (Two Buttons)
```tsx
<ActionPopup
  isOpen={true}
  title="Are you sure?"
  primaryLabel="yes, continue"
  secondaryLabel="cancel"
  showTertiary={false}
/>
```

## Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | boolean | Yes | - | Controls popup visibility |
| `title` | string | Yes | - | Main heading text |
| `onClose` | () => void | No | - | Called when backdrop is clicked |
| `onPrimaryAction` | () => void | No | - | Called when primary button clicked |
| `onSecondaryAction` | () => void | No | - | Called when secondary button clicked |
| `onTertiaryAction` | () => void | No | - | Called when tertiary button clicked |
| `primaryLabel` | string | No | "upload ur owns" | Primary button text |
| `secondaryLabel` | string | No | "generate" | Secondary button text |
| `tertiaryLabel` | string | No | "proceed" | Tertiary button text |
| `showTertiary` | boolean | No | true | Show/hide third button |

## Triggering the Popup

You can trigger the popup from anywhere in your app by controlling the `isOpen` state:

```tsx
// Trigger on button click
<button onClick={() => setShowPopup(true)}>
  Open Avatar Options
</button>

// Trigger on chat message
if (message.text.toLowerCase().includes('avatar')) {
  setShowAvatarPopup(true);
}

// Trigger on route change
useEffect(() => {
  if (pathname === '/avatar') {
    setShowPopup(true);
  }
}, [pathname]);
```


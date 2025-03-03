import javax.swing.*;
import java.awt.*;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.atomic.AtomicInteger;

public class Main {
    private static JLabel timeLabel;
    private static JLabel controlTimeLabel;
    private static JLabel statusLabel;
    private static Timer mainTimer;
    private static Timer controlTimer;
    private static final AtomicInteger mainSeconds = new AtomicInteger(0);
    private static final AtomicInteger controlSeconds = new AtomicInteger(0);
    private static int timeLimit = 5;

    private static final Color[] COLORS = {
            Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW, Color.ORANGE, Color.CYAN, Color.MAGENTA
    };

    public static void main(String[] args) {
        setDarkTheme();

        JFrame frame = new JFrame("Multi-threaded Timer");
        frame.setSize(500, 350);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new GridBagLayout());

        frame.getContentPane().setBackground(Color.DARK_GRAY);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 10, 0);
        gbc.anchor = GridBagConstraints.CENTER;

        timeLabel = new JLabel("Timer: 0 seconds");
        timeLabel.setForeground(Color.WHITE);
        frame.add(timeLabel, gbc);

        gbc.gridy++;
        controlTimeLabel = new JLabel("Control Timer: 0 seconds");
        controlTimeLabel.setForeground(Color.WHITE);
        frame.add(controlTimeLabel, gbc);

        gbc.gridy++;
        statusLabel = new JLabel("Status: Timer not started");
        statusLabel.setForeground(Color.WHITE);
        frame.add(statusLabel, gbc);

        gbc.gridy++;
        JButton startMainButton = new JButton("Start Main Timer");
        styleButton(startMainButton);
        frame.add(startMainButton, gbc);

        gbc.gridy++;
        JPanel intervalPanel = new JPanel(new FlowLayout());
        intervalPanel.setBackground(Color.DARK_GRAY);
        JTextField intervalField = new JTextField(5);
        intervalField.setPreferredSize(new Dimension(50, 25));
        intervalField.setBackground(Color.GRAY);
        intervalField.setForeground(Color.WHITE);
        JButton submitButton = new JButton("Set Interval");
        styleButton(submitButton);
        intervalPanel.add(intervalField);
        intervalPanel.add(submitButton);
        frame.add(intervalPanel, gbc);

        gbc.gridy++;
        JPanel limitPanel = new JPanel(new FlowLayout());
        limitPanel.setBackground(Color.DARK_GRAY);
        JTextField limitField = new JTextField(5);
        limitField.setPreferredSize(new Dimension(50, 25));
        limitField.setBackground(Color.GRAY);
        limitField.setForeground(Color.WHITE);
        JButton setLimitButton = new JButton("Set Time Limit");
        styleButton(setLimitButton);
        limitPanel.add(new JLabel("Time Limit:"));
        limitPanel.add(limitField);
        limitPanel.add(setLimitButton);
        frame.add(limitPanel, gbc);

        startMainButton.addActionListener(_ -> {
            if (mainTimer == null) {
                startMainTimer(startMainButton);
            } else {
                stopMainTimer(startMainButton);
            }
        });

        submitButton.addActionListener(_ -> {
            try {
                int newInterval = Integer.parseInt(intervalField.getText().trim());
                if (newInterval <= 0) throw new NumberFormatException();
                setControlInterval(newInterval);
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(frame, "Please enter a positive integer", "Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        setLimitButton.addActionListener(_ -> {
            try {
                int newLimit = Integer.parseInt(limitField.getText().trim());
                if (newLimit <= 0) throw new NumberFormatException();
                timeLimit = newLimit;
                JOptionPane.showMessageDialog(frame, "Time limit set to " + newLimit + " seconds", "Success", JOptionPane.INFORMATION_MESSAGE);
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(frame, "Please enter a positive integer", "Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        frame.setVisible(true);
    }

    private static void startMainTimer(JButton startMainButton) {
        mainTimer = new Timer();
        mainSeconds.set(0);

        mainTimer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                int currentSeconds = mainSeconds.incrementAndGet();
                SwingUtilities.invokeLater(() -> {
                    timeLabel.setText("Timer: " + currentSeconds + " seconds");
                    statusLabel.setText("Status: Main timer is running");
                    if (currentSeconds >= timeLimit) {
                        timeLabel.setForeground(COLORS[new java.util.Random().nextInt(COLORS.length)]);
                        stopMainTimer(startMainButton);
                        statusLabel.setText("Status: Main timer stopped (limit reached)");
                    }
                });
            }
        }, 1000, 1000);

        startMainButton.setText("Stop Main Timer");
    }

    private static void stopMainTimer(JButton startMainButton) {
        if (mainTimer != null) {
            mainTimer.cancel();
            mainTimer = null;
        }
        mainSeconds.set(0);
        timeLabel.setText("Timer: 0 seconds");
        statusLabel.setForeground(COLORS[new java.util.Random().nextInt(COLORS.length)]);
        startMainButton.setText("Start Main Timer");
    }

    private static void setControlInterval(int newInterval) {
        if (controlTimer != null) {
            controlTimer.cancel();
        }
        controlTimer = new Timer();
        controlSeconds.set(0);

        controlTimer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                int currentSeconds = controlSeconds.addAndGet(newInterval);
                SwingUtilities.invokeLater(() -> controlTimeLabel.setText("Control Timer: " + currentSeconds + " seconds"));
            }
        }, newInterval * 1000L, newInterval * 1000L);
    }

    private static void setDarkTheme() {
        UIManager.put("Panel.background", Color.DARK_GRAY);
        UIManager.put("Label.foreground", Color.WHITE);
        UIManager.put("Button.background", new Color(30, 144, 255));
        UIManager.put("Button.foreground", Color.WHITE);
        UIManager.put("TextField.background", Color.GRAY);
        UIManager.put("TextField.foreground", Color.WHITE);
        UIManager.put("TextField.caretForeground", Color.WHITE);
    }

    private static void styleButton(JButton button) {
        button.setBackground(new Color(30, 144, 255));
        button.setForeground(Color.WHITE);
        button.setFocusPainted(false);
        button.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(0, 0, 0, 50), 2),
                BorderFactory.createEmptyBorder(5, 15, 5, 15)
        ));
        button.setCursor(new Cursor(Cursor.HAND_CURSOR));

        button.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                button.setBackground(new Color(70, 130, 180));
            }

            public void mouseExited(java.awt.event.MouseEvent evt) {
                button.setBackground(new Color(30, 144, 255));
            }
        });
    }
}
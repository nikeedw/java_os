import javax.swing.*;
import java.awt.*;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.atomic.AtomicInteger;

public class TimerLogic {
    private final JLabel timeLabel;
    private final JLabel controlTimeLabel;
    private final JLabel statusLabel;
    private Timer mainTimer;
    private Timer controlTimer;
    private final AtomicInteger mainSeconds = new AtomicInteger(0);
    private final AtomicInteger controlSeconds = new AtomicInteger(0);
    private int timeLimit = 5;
    private final JButton startMainButton;

    private static final Color[] COLORS = {
            Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW, Color.ORANGE, Color.CYAN, Color.MAGENTA
    };

    public TimerLogic(JLabel timeLabel, JLabel controlTimeLabel, JLabel statusLabel, JButton startMainButton) {
        this.timeLabel = timeLabel;
        this.controlTimeLabel = controlTimeLabel;
        this.statusLabel = statusLabel;
        this.startMainButton = startMainButton;
    }

    public void startMainTimer() {
        if (mainTimer == null) {
            mainTimer = new Timer();
            mainSeconds.set(0);

            // some comment

            mainTimer.scheduleAtFixedRate(new TimerTask() {
                @Override
                public void run() {
                    int currentSeconds = mainSeconds.incrementAndGet();
                    SwingUtilities.invokeLater(() -> {
                        timeLabel.setText("Timer: " + currentSeconds + " seconds");
                        statusLabel.setText("Status: Main timer is running");
                        if (currentSeconds >= timeLimit) {
                            timeLabel.setForeground(COLORS[new java.util.Random().nextInt(COLORS.length)]);
                            stopMainTimer();
                            statusLabel.setText("Status: Main timer stopped (limit reached)");
                        }
                    });
                }
            }, 1000, 1000);

            startMainButton.setText("Stop Main Timer");
        } else {
            stopMainTimer();
        }
    }

    public void stopMainTimer() {
        if (mainTimer != null) {
            mainTimer.cancel();
            mainTimer = null;
        }
        mainSeconds.set(0);
        timeLabel.setText("Timer: 0 seconds");
        statusLabel.setForeground(COLORS[new java.util.Random().nextInt(COLORS.length)]);
        startMainButton.setText("Start Main Timer");
    }

    public void setControlInterval(int newInterval) {
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

    public void setTimeLimit(int newLimit) {
        this.timeLimit = newLimit;
    }
}
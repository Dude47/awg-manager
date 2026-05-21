package env

import (
	"os"
	"testing"
)

func TestIntDefault_Unset(t *testing.T) {
	os.Unsetenv("AWG_TEST_INT")
	if got := IntDefault("AWG_TEST_INT", 42); got != 42 {
		t.Errorf("unset: want 42, got %d", got)
	}
}

func TestIntDefault_Valid(t *testing.T) {
	t.Setenv("AWG_TEST_INT", "7")
	if got := IntDefault("AWG_TEST_INT", 42); got != 7 {
		t.Errorf("valid: want 7, got %d", got)
	}
}

func TestIntDefault_NonNumeric(t *testing.T) {
	t.Setenv("AWG_TEST_INT", "abc")
	if got := IntDefault("AWG_TEST_INT", 42); got != 42 {
		t.Errorf("non-numeric: want default 42, got %d", got)
	}
}

func TestIntDefault_Zero(t *testing.T) {
	t.Setenv("AWG_TEST_INT", "0")
	if got := IntDefault("AWG_TEST_INT", 42); got != 42 {
		t.Errorf("zero: want default 42, got %d", got)
	}
}

func TestIntDefault_Negative(t *testing.T) {
	t.Setenv("AWG_TEST_INT", "-5")
	if got := IntDefault("AWG_TEST_INT", 42); got != 42 {
		t.Errorf("negative: want default 42, got %d", got)
	}
}

func TestIntDefault_Empty(t *testing.T) {
	t.Setenv("AWG_TEST_INT", "")
	if got := IntDefault("AWG_TEST_INT", 42); got != 42 {
		t.Errorf("empty: want default 42, got %d", got)
	}
}
